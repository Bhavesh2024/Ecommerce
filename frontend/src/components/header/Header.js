import React from "react";

const Header = ({ title = "", btn = {} }) => {
	const { name, type, icon, handler, classes } = btn;
	return (
		<>
			<div className='flex flex-col border-b h-fit items-center justify-between px-1 py-1 border-slate-400 w-full '>
				<div className='flex items-center justify-between w-full'>
					<h1 className='text-xl text-slate-600 font-semibold'>
						{title}
					</h1>
					<button
						className={
							classes
								? classes
								: "bg-blue-600 rounded-md h-10 min-w-20 w-fit text-nowrap text-white flex items-center justify-center"
						}
						type={type ? type : "button"}
						onClick={handler}>
						{icon}
						{name}
					</button>
				</div>
			</div>
		</>
	);
};

export default Header;
