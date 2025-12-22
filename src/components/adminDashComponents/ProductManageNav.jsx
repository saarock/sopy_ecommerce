
const ProductManageNav = ({ setWhatUserWant, userWant }) => {
  return (
    <nav className="bg-white rounded-lg shadow-sm p-2 mb-6">
      <ul className="flex flex-col sm:flex-row gap-2 sm:gap-4">
        <li
          className={`flex-1 px-4 py-3 rounded-lg text-center cursor-pointer transition-all duration-300 ${
            userWant === "2" ? "bg-[#1a2250] text-white shadow-md" : "bg-gray-50 text-gray-700 hover:bg-gray-100"
          }`}
          onClick={() => setWhatUserWant("2")}
        >
          <span className="font-medium text-sm sm:text-base">Show All Products</span>
        </li>
        <li
          className={`flex-1 px-4 py-3 rounded-lg text-center cursor-pointer transition-all duration-300 ${
            userWant === "0" ? "bg-[#1a2250] text-white shadow-md" : "bg-gray-50 text-gray-700 hover:bg-gray-100"
          }`}
          onClick={() => setWhatUserWant("0")}
        >
          <span className="font-medium text-sm sm:text-base">Show Disabled Products</span>
        </li>
        <li
          className={`flex-1 px-4 py-3 rounded-lg text-center cursor-pointer transition-all duration-300 ${
            userWant === "1" ? "bg-[#1a2250] text-white shadow-md" : "bg-gray-50 text-gray-700 hover:bg-gray-100"
          }`}
          onClick={() => setWhatUserWant("1")}
        >
          <span className="font-medium text-sm sm:text-base">Show Available Products</span>
        </li>
      </ul>
    </nav>
  )
}

export default ProductManageNav
