import React ,{useState} from 'react';

export default function Post_prossesing() {
type User = { id: string; name: string; email: string };

const users: User[] = [
  { id: "1", name: "Indiana", email: "indian@example.com" },
  { id: "2", name: "Kenny", email: "kenny@example.com" },
  { id: "2", name: "Kenny", email: "kenny@example.com" },
  { id: "2", name: "Kenny", email: "kenny@example.com" },
  { id: "2", name: "Kenny", email: "kenny@example.com" },
  { id: "2", name: "Kenny", email: "kenny@example.com" },
  { id: "2", name: "Kenny", email: "kenny@example.com" },
  { id: "2", name: "Kenny", email: "kenny@example.com" },
  { id: "2", name: "Kenny", email: "kenny@example.com" },
  { id: "2", name: "Kenny", email: "kenny@example.com" },
  { id: "2", name: "Kenny", email: "kenny@example.com" },
  { id: "2", name: "Kenny", email: "kenny@example.com" },
  { id: "2", name: "Kenny", email: "kenny@example.com" },

  // ...map dữ liệu thật của bạn
];

  return (
 
   <div className=" w-[90%] mx-auto h-[600px] bg-white flex flex-col items-center rounded-[20px]  px-2 py-5 ">
<div className='w-full overflow-y-auto '>


<table className="w-[90%] text-black ">
   <thead className="sticky top-0 bg-white z-10">
    <tr>
      <th className="px-3 py-2 border-none text-left">STT </th>
      <th className="px-3 py-2 border-none text-left">Tên Người dùng </th>
      <th className="px-3 py-2 border-none text-left">Email</th>
    


    </tr>
  </thead>
 
          <tbody className="align-top">
            {users.map((u) => (
              <tr key={u.id} className="group">
                {/* Tô màu từng ô để bo góc đẹp */}
                 <td className="px-3 py-2 rounded-l-[20px] transition group-hover:bg-sky-300/70">
                  {u.id}
                </td>
                <td className="px-3 py-2 transition group-hover:bg-sky-300/70">
                  {u.name}
                </td>
                <td className="px-3 py-2 rounded-r-[20px] transition group-hover:bg-sky-300/70">
                  {u.email}
                </td>
              
              </tr>
            ))}
          </tbody>
</table>  
</div>
    </div>
  );
}
