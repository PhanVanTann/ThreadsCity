import { useState } from 'react'
import { FaGoogle } from 'react-icons/fa'
import { NavLink } from 'react-router'

export default function Register() {
  const [showPassword, setShowPassword] = useState(false)
  const [form, setForm] = useState({
    name: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    rePassword: ''
  })
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  function validate() {
    const newErrors: { [key: string]: string } = {}
    if (!form.name) newErrors.name = 'Tên không được để trống'
    if (!form.lastName) newErrors.lastName = 'Họ không được để trống'
    if (!form.email) newErrors.email = 'Email không được để trống'
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'Email không hợp lệ'
    if (!form.phone) newErrors.phone = 'Số điện thoại không được để trống'
    if (!form.password) newErrors.password = 'Mật khẩu không được để trống'
    if (form.password.length < 6) newErrors.password = 'Mật khẩu phải từ 6 ký tự'
    if (form.password !== form.rePassword) newErrors.rePassword = 'Mật khẩu nhập lại không khớp'
    return newErrors
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.id.replace(' ', '')]: e.target.value })
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const newErrors = validate()
    setErrors(newErrors)
    if (Object.keys(newErrors).length === 0) {
      // Submit form
    }
  }

  return (
    <div className='flex flex-col items-center p-8 justify-center h-min-screen bg-gray-100 dark:bg-[#000] gap-5'>
      <div className='w-[450px] flex flex-col items-center  p-8 border border-[#353535] rounded shadow-md'>
        <div className='w-[350px] h-[120px] select-none'>
          <img src='../../public/1688663419threads-logo.png' alt='logo' className='bg-white dark:bg-gray-800' />
        </div>
        <div>
          <form onSubmit={handleSubmit} action='' className='flex flex-col items-center select-none gap-1 mt-4'>
            <input
              id='name'
              type='text'
              placeholder='Name'
              onChange={handleChange}
              className='w-[300px] p-2 border border-[#353535] rounded select-none focus:outline-none focus:ring-0 focus:border-[#353535]'
            />
            {errors.name && <span className='text-red-500 text-xs'>{errors.name}</span>}
            <input
              id='last name'
              type='text'
              placeholder='Last name'
              onChange={handleChange}
              className='w-[300px] p-2 border border-[#353535] rounded select-none focus:outline-none focus:ring-0 focus:border-[#353535]'
            />
            {errors.lastName && <span className='text-red-500 text-xs'>{errors.lastName}</span>}
            <input
              id='email'
              type='text'
              placeholder='Email'
              onChange={handleChange}
              className='w-[300px] p-2 border border-[#353535] rounded select-none focus:outline-none focus:ring-0 focus:border-[#353535]'
            />
            {errors.email && <span className='text-red-500 text-xs'>{errors.email}</span>}
            <input
              id='phone number'
              type='text'
              placeholder='Phone number'
              className='w-[300px] p-2 border border-[#353535] rounded select-none focus:outline-none focus:ring-0 focus:border-[#353535]'
            />
            {errors.phone && <span className='text-red-500 text-xs'>{errors.phone}</span>}
            <div className='relative w-[300px]'>
              <input
                id='password'
                type={showPassword ? 'text' : 'password'}
                placeholder='Password'
                onChange={handleChange}
                className='w-full p-2 border border-[#353535] rounded pr-10 select-none focus:outline-none focus:ring-0 focus:border-[#353535]'
              />
              <button
                type='button'
                className='absolute right-2 top-2 text-sm text-gray-500 cursor-pointer'
                onClick={() => setShowPassword((v) => !v)}
                tabIndex={-1}
              >
                {showPassword ? 'Ẩn' : 'Hiện'}
              </button>
            </div>
            {errors.password && <span className='text-red-500 text-xs'>{errors.password}</span>}
            <div className='relative w-[300px]'>
              <input
                id='re password'
                type={showPassword ? 'text' : 'password'}
                placeholder='re Password'
                onChange={handleChange}
                className='w-full p-2 border border-[#353535] rounded pr-10 select-none focus:outline-none focus:ring-0 focus:border-[#353535]'
              />
              <button
                type='button'
                className='absolute right-2 top-2 text-sm text-gray-500 cursor-pointer'
                onClick={() => setShowPassword((v) => !v)}
                tabIndex={-1}
              >
                {showPassword ? 'Ẩn' : 'Hiện'}
              </button>
            </div>
            {errors.rePassword && <span className='text-red-500 text-xs'>{errors.rePassword}</span>}
            <button
              type='submit'
              className='w-[300px] bg-blue-600 text-white mt-[20px] select-none cursor-pointer p-2 rounded-lg hover:bg-blue-500 transition-colors'
            >
              Đăng nhập
            </button>
            <div className='flex items-center text-[12px] select-none'>
              <div className='h-[1px] w-[100px] bg-[#5c5c5c] mr-5'></div> OR
              <div className='h-[1px] w-[100px] bg-[#5c5c5c] ml-5'></div>
            </div>
          </form>
          <div className='flex items-center justify-center mt-4'>
            <button type='button' className='flex items-center cursor-pointer select-none gap-2'>
              <FaGoogle color='#fff' size={20} />
              <span>Đăng nhập với Google</span>
            </button>
          </div>
        </div>
      </div>
      <div className='w-[450px] flex flex-col items-center  p-6 border border-[#353535] rounded shadow-md'>
        <p className='text-[18px]  text-gray-500 select-none'>
          Bạn đã có tài khoản?
          <span className='text-white'>
            <NavLink to='/login'> Đăng ký</NavLink>
          </span>
        </p>
      </div>
    </div>
  )
}
