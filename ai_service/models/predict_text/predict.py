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
    words = text.split()

    wp_tokens = _tokenize_phobert_words(words)

    num_special = tokenizer.num_special_tokens_to_add(pair=False)  
    keep = max(0, MAX_LEN - num_special)
    wp_tokens = wp_tokens[:keep]


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

   
    preds = preds[1:-1] if len(preds) >= 2 else []
   
    words_merged, labels_merged = _merge_bpe(wp_tokens, preds)

    masked_words = []
    out_words = []
    for w, lab in zip(words_merged, labels_merged):
        if lab == 1:                     
            out_words.append(_mask_word(w))
            masked_words.append(w)
        else:
            out_words.append(w)

    masked_text = " ".join(out_words)

    return {
        "postid": str(postid),
        "masked_text": masked_text,         
        "masked_words": masked_words,         
    }