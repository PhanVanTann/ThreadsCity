import re
from pathlib import Path
from transformers import AutoModelForTokenClassification, AutoTokenizer
import torch

MAX_LEN = 256
MODEL_DIR = Path("models/predict_text/best_model").resolve()

model = AutoModelForTokenClassification.from_pretrained(str(MODEL_DIR), local_files_only=True)
tokenizer = AutoTokenizer.from_pretrained(str(MODEL_DIR), use_fast=False, local_files_only=True)

def _tokenize_phobert_words(words):
    wp_tokens = []
    for i, w in enumerate(words):
        piece = (" " + w) if i != 0 else w  # slow tokenizer không nhận add_prefix_space
        sub_toks = tokenizer.tokenize(piece)
        if sub_toks:
            wp_tokens.extend(sub_toks)
    return wp_tokens

def _merge_bpe(tokens, labels):
    """Gộp token BPE 'bạ@@','n@@' -> 'bạn'; lấy label của mảnh đầu làm nhãn đại diện."""
    merged_tokens, merged_labels = [], []
    buf_toks, buf_labs = [], []

    def flush():
        if not buf_toks:
            return
        word = "".join(t.replace("@@", "") for t in buf_toks)
        merged_tokens.append(word)
        merged_labels.append(buf_labs[0])
        buf_toks.clear()
        buf_labs.clear()

    for t, lab in zip(tokens, labels):
        buf_toks.append(t)
        buf_labs.append(lab)
        if not t.endswith("@@"):
            flush()
    flush()
    return merged_tokens, merged_labels

def _mask_word(w):
    return "*" * len(w)

def predict_text(postid, text: str):
    # Chuẩn hóa newline để nhất quán
    original_text = text.replace("\r\n", "\n")

    # 1) Cắt chuỗi nhưng GIỮ nguyên whitespace (xuống dòng, tab, nhiều space)
    
    tokens = re.split(r'(\s+)', original_text)
    # Lấy danh sách "từ" (non-whitespace) theo đúng thứ tự xuất hiện
    words = [t for t in tokens if not t.isspace() and t != ""]

    # 2) Tokenize theo PhoBERT
    wp_tokens = _tokenize_phobert_words(words)

    # 3) Cắt theo MAX_LEN (tính trên wordpiece + special)
    num_special = tokenizer.num_special_tokens_to_add(pair=False)
    keep_wp = max(0, MAX_LEN - num_special)
    wp_tokens = wp_tokens[:keep_wp]

    # 4) Model predict
    wp_ids = tokenizer.convert_tokens_to_ids(wp_tokens)
    input_ids = tokenizer.build_inputs_with_special_tokens(wp_ids)
    attention_mask = [1] * len(input_ids)

    inputs = {
        "input_ids": torch.tensor([input_ids]),
        "attention_mask": torch.tensor([attention_mask]),
    }
    if "token_type_ids" in tokenizer.model_input_names:
        inputs["token_type_ids"] = torch.zeros_like(inputs["input_ids"])

    model.eval()
    with torch.no_grad():
        logits = model(**inputs).logits
        preds = torch.argmax(logits, dim=-1).squeeze(0).tolist()

    # Bỏ special tokens ở 2 đầu
    preds = preds[1:-1] if len(preds) >= 2 else []

    # 5) Gộp BPE về "từ" đã đưa vào model
    words_merged, labels_merged = _merge_bpe(wp_tokens, preds)

   
    # 6) Tạo iterator cho words đã (có thể) che
    masked_seq = []
    for w, lab in zip(words_merged, labels_merged):
        masked_seq.append(_mask_word(w) if lab == 1 else w)

    # Nếu còn words chưa được đưa qua model vì truncate, giữ nguyên
    if len(masked_seq) < len(words):
        masked_seq.extend(words[len(masked_seq):])

    # 7) Dựng lại văn bản theo token gốc (giữ nguyên mọi khoảng trắng)
    out = []
    word_idx = 0
    for tok in tokens:
        if tok.isspace() or tok == "":
            out.append(tok)  # giữ nguyên '\n', '  ', '\t', ...
        else:
            # lấy từ đã che/không che tương ứng theo thứ tự
            out.append(masked_seq[word_idx] if word_idx < len(masked_seq) else tok)
            word_idx += 1

    masked_text = "".join(out)

    return {
        "postid": str(postid),
        "masked_text": masked_text,     
        "masked_words": [w for w, lab in zip(words_merged, labels_merged) if lab == 1],
    }
