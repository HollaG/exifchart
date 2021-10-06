import NavItem from "./NavItem"

const Navbar = () => { 
    return (        
        <nav className="w-screen bg-gray-600 h-20">
            <ul className="px-2 flex w-screen lg:w-9/12 m-auto items-center h-full justify-between">
                <NavItem isHeader={true} to="/"> EXIFChart </NavItem>
                <NavItem isHeader={false} to="/help"> How to use </NavItem>                
            </ul>
        </nav>        
    )
}

export default Navbar