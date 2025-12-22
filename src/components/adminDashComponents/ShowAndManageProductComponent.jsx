import { useEffect, useState } from "react"
import productService from "../../services/productService"
import { useDispatch } from "react-redux"
import useUser from "../../hooks/useUser"
import { toast } from "react-toastify"
import { addToCart } from "../../features/product/productSlice.js"
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner.jsx"
import { categoryOptions } from "../../constant.js"
import Product from "../Product/Product.jsx"
import UserProductCard from "../Product/UserProductCard.jsx"
import { Filter, DollarSign, RotateCcw } from "lucide-react"

const ShowAndManageProductComponent = ({ adminWant = "1", refresh }) => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("2")
  const [availabilityFilter, setAvailabilityFilter] = useState("2")
  const [minPrice, setMinPrice] = useState("")
  const [maxPrice, setMaxPrice] = useState("")
  const [totalItem, setTotalItem] = useState(1)
  const { user } = useUser()
  const productsPerPage = user?.role === "admin" ? 7 : 8
  const dispatch = useDispatch()

  // 0 => false
  // 1 => true
  // 2 => all

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await productService.getProducts(
          currentPage,
          productsPerPage,
          searchQuery,
          categoryFilter,
          availabilityFilter,
          adminWant,
          minPrice,
          maxPrice
        )

        setProducts(data.data.products)
        setTotalPages(data.data.totalPages)
        setLoading(false)
      } catch (error) {
        console.error("Failed to fetch products:", error)
        setLoading(false)
      }
    }

    fetchProducts()
  }, [currentPage, searchQuery, categoryFilter, availabilityFilter, adminWant, refresh, minPrice, maxPrice])

  const handelPaginationWorks = async () => {
    const data = await productService.getProducts(
      currentPage,
      productsPerPage,
      searchQuery,
      categoryFilter,
      availabilityFilter,
      adminWant,
      minPrice,
      maxPrice
    )
    setProducts(data.data.products)
    setTotalPages(data.data.totalPages)
    setLoading(false)
  }

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const handleDeleteProduct = async (productId) => {
    try {
      setLoading(true)
      await productService.deleteProduct(productId)
      handelPaginationWorks()
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleToggleAvailability = async (productId) => {
    try {
      setLoading(true)

      await productService.toggleProductAvailability(productId) // Assumes a service method exists
      handelPaginationWorks()
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleFormSubmit = async (productDetails) => {
    try {
      setLoading(true)
      await productService.editProduct(productDetails) // Assumes a service method exists
      handelPaginationWorks()
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  const addToCartBtn = (event, userId, productId, name, price, imageUrl) => {
    event.preventDefault()
    toast.success("Product added to cart successfully!")
    const product = {
      userId,
      productId,
      totalItem,
      totalPrice: price * totalItem,
      imageUrl,
      productName: name,
    }

    dispatch(addToCart(product))
  }

  const handleResetFilters = () => {
    setSearchQuery("")
    setCategoryFilter("2")
    setAvailabilityFilter("2")
    setMinPrice("")
    setMaxPrice("")
    setCurrentPage(1)
  }

  const isAdmin = user?.role === "admin"

  return (
    <div className="w-full min-h-screen bg-[#f8fafc] p-4 sm:p-6 lg:p-8">
      {loading ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <LoadingSpinner />
        </div>
      ) : (
        <div className="max-w-7xl mx-auto space-y-10">
          {/* Enhanced Search & Branding (User View) */}
          {!isAdmin && (
            <div className="text-center space-y-4 mb-12">
              <h1 className="text-5xl font-black text-[#101540] tracking-tight">
                Premium <span className="bg-gradient-to-r from-[#101540] to-[#1a2060] bg-clip-text text-transparent">Inventory</span>
              </h1>
              <p className="text-gray-400 font-medium max-w-2xl mx-auto">
                Discover and manage high-performance assets with our next-generation inventory management system.
              </p>
            </div>
          )}

          {/* Controls Section */}
          <div className="bg-white/80 backdrop-blur-xl p-8 rounded-[3rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white space-y-8">
            <div className="relative group">
              <input
                type="text"
                className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-gray-50 bg-gray-50 focus:bg-white focus:border-[#101540] focus:ring-4 focus:ring-[#101540]/5 text-gray-900 placeholder-gray-400 transition-all duration-300 font-medium"
                placeholder="Search inventory by name or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400 group-focus-within:text-[#101540] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Category Filter */}
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Department</label>
                <div className="relative">
                  <select
                    className="w-full appearance-none px-4 py-3.5 rounded-2xl border-2 border-gray-50 bg-gray-50 focus:bg-white focus:border-[#101540] text-[#101540] font-bold transition-all cursor-pointer"
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                  >
                    <option value="2">All Categories</option>
                    {categoryOptions?.map((ca) => (
                      <option key={ca.value} value={ca.value}>{ca.label}</option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Availability Filter */}
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Inventory Status</label>
                <div className="relative">
                  <select
                    className="w-full appearance-none px-4 py-3.5 rounded-2xl border-2 border-gray-50 bg-gray-50 focus:bg-white focus:border-[#101540] text-[#101540] font-bold transition-all cursor-pointer"
                    value={availabilityFilter}
                    onChange={(e) => setAvailabilityFilter(e.target.value)}
                  >
                    <option value="2">Show All Items</option>
                    <option value="1">Available Only</option>
                    <option value="0">Out of Stock</option>
                    <option value="low">Low Stock Warning</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Price Range Filter */}
              <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-6 items-end">
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Min Price</label>
                  <div className="relative">
                    <input
                      type="number"
                      placeholder="Min"
                      className="w-full px-4 py-3.5 rounded-2xl border-2 border-gray-50 bg-gray-50 focus:bg-white focus:border-[#101540] text-[#101540] font-bold transition-all"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                    />
                    <DollarSign className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Max Price</label>
                  <div className="relative">
                    <input
                      type="number"
                      placeholder="Max"
                      className="w-full px-4 py-3.5 rounded-2xl border-2 border-gray-50 bg-gray-50 focus:bg-white focus:border-[#101540] text-[#101540] font-bold transition-all"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                    />
                    <DollarSign className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                  </div>
                </div>
                <button
                  onClick={handleResetFilters}
                  className="flex items-center justify-center gap-2 px-6 py-4 bg-gray-50 text-gray-400 hover:text-[#101540] hover:bg-gray-100 rounded-2xl font-black text-xs uppercase tracking-widest transition-all h-[54px]"
                >
                  <RotateCcw className="w-4 h-4" /> Reset
                </button>
              </div>
            </div>
          </div>

          {/* Product Listing - Role Based */}
          {isAdmin ? (
            /* Admin Table View */
            <div className="hidden lg:block bg-white rounded-[3rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white overflow-hidden">
              {products.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-[#101540] text-white">
                      <tr>
                        <th className="px-8 py-6 text-left text-xs font-black uppercase tracking-widest opacity-80">Reference</th>
                        <th className="px-8 py-6 text-left text-xs font-black uppercase tracking-widest opacity-80">Product Name</th>
                        <th className="px-8 py-6 text-center text-xs font-black uppercase tracking-widest opacity-80">Status</th>
                        <th className="px-8 py-6 text-left text-xs font-black uppercase tracking-widest opacity-80">Description</th>
                        <th className="px-8 py-6 text-left text-xs font-black uppercase tracking-widest opacity-80">Price</th>
                        <th className="px-8 py-6 text-left text-xs font-black uppercase tracking-widest opacity-80">Stock</th>
                        <th className="px-8 py-6 text-right text-xs font-black uppercase tracking-widest opacity-80">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {products.map((product) => (
                        <Product
                          key={product._id}
                          product={product}
                          handleDeleteProduct={handleDeleteProduct}
                          handleToggleAvailability={handleToggleAvailability}
                          user={user}
                          handleFormSubmit={handleFormSubmit}
                          addToCart={addToCartBtn}
                          setTotalItem={setTotalItem}
                        />
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <EmptyState />
              )}
            </div>
          ) : (
            /* User Grid View */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {products.length > 0 ? (
                products.map((product) => (
                  <UserProductCard
                    key={product._id}
                    product={product}
                    user={user}
                    addToCart={addToCartBtn}
                    setTotalItem={setTotalItem}
                  />
                ))
              ) : (
                <div className="col-span-full">
                  <EmptyState />
                </div>
              )}
            </div>
          )}

          {/* Product Listing - Mobile/Tablet Admin (Fallback) */}
          {isAdmin && (
            <div className="lg:hidden grid grid-cols-1 md:grid-cols-2 gap-6">
              {products.length > 0 ? (
                products.map((product) => (
                  <div key={product._id} className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-2 overflow-hidden hover:shadow-xl transition-shadow duration-300">
                    <Product
                      product={product}
                      handleDeleteProduct={handleDeleteProduct}
                      handleToggleAvailability={handleToggleAvailability}
                      user={user}
                      handleFormSubmit={handleFormSubmit}
                      addToCart={addToCartBtn}
                      setTotalItem={setTotalItem}
                    />
                  </div>
                ))
              ) : (
                <EmptyState />
              )}
            </div>
          )}

          {/* Pagination Section */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mt-12 bg-white/50 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <p className="text-sm font-black text-gray-400 uppercase tracking-widest">
              Showing <span className="text-[#101540]">{products.length}</span> items of <span className="text-[#101540]">{currentPage * productsPerPage}</span>
            </p>

            <div className="flex items-center gap-4">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className="group flex items-center gap-3 px-8 py-4 bg-white text-[#101540] rounded-2xl font-black text-xs uppercase tracking-widest shadow-sm ring-1 ring-gray-100 hover:bg-[#101540] hover:text-white disabled:opacity-30 disabled:grayscale transition-all duration-300"
              >
                <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7" /></svg>
                Prev
              </button>

              <div className="flex items-center gap-2 px-6 py-4 bg-[#101540] rounded-2xl text-white font-black shadow-2xl shadow-[#101540]/20">
                <span className="opacity-40 text-[10px] uppercase tracking-widest mr-1">Page</span>
                <span className="text-sm">{currentPage}</span>
                <span className="opacity-20 font-medium mx-1">/</span>
                <span className="text-sm">{totalPages}</span>
              </div>

              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="group flex items-center gap-3 px-8 py-4 bg-white text-[#101540] rounded-2xl font-black text-xs uppercase tracking-widest shadow-sm ring-1 ring-gray-100 hover:bg-[#101540] hover:text-white disabled:opacity-30 disabled:grayscale transition-all duration-300"
              >
                Next
                <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" /></svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const EmptyState = () => (
  <div className="py-32 text-center space-y-4 bg-white rounded-[3rem] border-2 border-dashed border-gray-100">
    <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto">
      <Filter className="w-12 h-12 text-gray-200" />
    </div>
    <div className="space-y-1">
      <p className="text-xl font-black text-[#101540]">No matches found</p>
      <p className="text-gray-400 font-medium">Try broadening your search criteria.</p>
    </div>
  </div>
)

export default ShowAndManageProductComponent
