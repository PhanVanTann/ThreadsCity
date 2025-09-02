'use client';
import { useState } from "react";
import { FaGoogle } from "react-icons/fa";  
import { useNavigate,NavLink } from "react-router";
import { useDispatch } from "react-redux";
import { registerUser } from "src/redux/api/apiRequestAuth";


export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const distpach = useDispatch()
  const navigate = useNavigate();
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    rePassword: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  function validate() {
    const newErrors: { [key: string]: string } = {};
    if (!form.first_name) newErrors.first_name = "Tên không được để trống";
    if (!form.last_name) newErrors.last_name = "Họ không được để trống";
    if (!form.email) newErrors.email = "Email không được để trống";
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = "Email không hợp lệ";
    // if (!form.phone) newErrors.phone = "Số điện thoại không được để trống";
    if (!form.password) newErrors.password = "Mật khẩu không được để trống";
    if (form.password.length < 6) newErrors.password = "Mật khẩu phải từ 6 ký tự";
    if (form.rePassword.length < 6) newErrors.rePassword = "Mật khẩu phải từ 6 ký tự";
    if (!form.rePassword) newErrors.rePassword = "Mật khẩu không được để trống";
    if (form.password !== form.rePassword) newErrors.rePassword = "Mật khẩu nhập lại không khớp";
    return newErrors;
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.id.replace(" ", "")]: e.target.value });
  }

   async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    console.log("Form submitted:");
    const v = validate();
    setErrors(v);
    if (Object.keys(v).length > 0) return;
    registerUser(form, distpach, navigate);
   
  }


  return (
    <div className="flex flex-col items-center p-8 justify-center h-min-screen bg-gray-100 dark:bg-[#000] gap-5">
     <div className="w-[450px] flex flex-col items-center  p-8 border border-[#353535] rounded shadow-md">
       <div className=" h-[60px] flex select-none items-center rounded-[18px] bg-white text-black">
            <img src="../../public/COLOURBOX5754411.webp" alt="logo" className="h-full bg-white rounded-[16px] dark:bg-[#fff]" />
            <h1 className="text-[50px] px-1  font-bold">WINTER CITY</h1>
        </div>
        <div >
           <form onSubmit={handleSubmit} action="" className="flex flex-col items-center select-none gap-1 mt-4">
                   
                   <input
                        id="first_name"
                        type="text"
                        placeholder="first name"
                        value={form.first_name}
                        onChange={handleChange}
                        className="w-[300px] p-2 border border-[#353535] rounded select-none focus:outline-none focus:ring-0 focus:border-[#353535]"
                    />
                     {(errors.first_name || !form.first_name) && <span className="text-red-500 text-xs">{errors.first_name}</span>}
                       <input
                        id="last_name"
                        type="text"
                        placeholder="Last name"
                        value={form.last_name}
                        onChange={handleChange}
                        className="w-[300px] p-2 border border-[#353535] rounded select-none focus:outline-none focus:ring-0 focus:border-[#353535]"
                    />
                    {(errors.last_name || !form.last_name) && <span className="text-red-500 text-xs">{errors.last_name}</span>}
                        <input
                        id="email"
                        type="text"
                        placeholder="Email"
                        value={form.email}
                        onChange={handleChange}
                        className="w-[300px] p-2 border border-[#353535] rounded select-none focus:outline-none focus:ring-0 focus:border-[#353535]"
                    />
                    {(errors.email || !form.email) && <span className="text-red-500 text-xs">{errors.email}</span>}
                       
                   <div className="relative w-[300px]">
                        <input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Password"
                          value={form.password}
                          onChange={handleChange}
                          className="w-full p-2 border border-[#353535] rounded pr-10 select-none focus:outline-none focus:ring-0 focus:border-[#353535]"
                        />
                        <button
                          type="button"
                          className="absolute right-2 top-2 text-sm text-gray-500 cursor-pointer"
                          onClick={() => setShowPassword((v) => !v)}
                          tabIndex={-1}
                        >
                          {showPassword ? "Ẩn" : "Hiện"}
                        </button>
                   </div>
                    {(errors.password || !form.password) && <span className="text-red-500 text-xs">{errors.password}</span>}
                       <div className="relative w-[300px]">
                        <input
                          id="rePassword"
                          type={showPassword ? "text" : "password"}
                          placeholder="re Password"
                          value={form.rePassword}
                          onChange={handleChange}
                          className="w-full p-2 border border-[#353535] rounded pr-10 select-none focus:outline-none focus:ring-0 focus:border-[#353535]"
                        />
                        <button
                          type="button"
                          className="absolute right-2 top-2 text-sm text-gray-500 cursor-pointer"
                          onClick={() => setShowPassword((v) => !v)}
                          tabIndex={-1}
                        >
                          {showPassword ? "Ẩn" : "Hiện"}
                        </button>
                   </div>
                     {(errors.rePassword || !form.rePassword) && <span className="text-red-500 text-xs">{errors.rePassword}</span>}
                      <button
                          type="submit"
                          className="w-[300px] bg-blue-600 text-white mt-[20px] select-none cursor-pointer p-2 rounded-lg hover:bg-blue-500 transition-colors">
                        Đăng ký
                      </button>
                    <div className="flex items-center text-[12px] select-none"><div className="h-[1px] w-[100px] bg-[#5c5c5c] mr-5"></div> OR<div className="h-[1px] w-[100px] bg-[#5c5c5c] ml-5"></div></div>
             </form>
            <div className="flex items-center justify-center mt-4">
                <button  type="button" className="flex items-center cursor-pointer select-none gap-2">
                  <FaGoogle color="#fff" size={20} />
                  <span>Đăng nhập với Google</span>
                </button>
            </div>
             
            
        </div>
     </div>
        <div className="w-[450px] flex flex-col items-center  p-6 border border-[#353535] rounded shadow-md">
            <p className="text-[18px]  text-gray-500 select-none">
              Bạn đã có tài khoản?
              
              <span className="text-white"><NavLink to="/login"> Đăng nhập</NavLink></span>
               
             
            </p>
        </div>
    </div>
  );
}
