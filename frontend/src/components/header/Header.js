import React from "react";

const Header = ({ title = "", btn = {}, enableBtn = true }) => {
	const { name, type, icon, handler, classes } = btn;
	return (
		<>
			<div className='flex flex-col border-b  h-fit items-center justify-between px-1 py-1 border-slate-300 w-full mt-5 '>
				<div className='flex items-center justify-between w-full'>
					<h1 className='text-lg text-slate-700 font-medium font-sans'>
						{title}
					</h1>
					{enableBtn && (
						<button
							className={
								classes
									? classes
									: "bg-purple-700 hover:bg-purple-500 rounded-md h-10 text-sm min-w-20 w-fit text-nowrap text-white flex items-center justify-center"
							}
							type={type ? type : "button"}
							onClick={handler}>
							{icon}
							{name}
						</button>
					)}
				</div>
			</div>
		</>
	);
};

export default Header;
