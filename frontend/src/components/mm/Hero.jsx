import logo from "./1.png"

const Hero = () => {
  return (
    <section className="bg-white rounded-[15px] my-5 overflow-hidden h-auto md:h-[500px]">
      <div className="flex flex-col md:flex-row justify-between items-center p-8 h-full border-[3px] border-lightgreen rounded-[23px] bg-gradient-to-b from-white from-60% to-[#00a651] to-40% md:bg-gradient-to-r md:from-white md:from-50% md:to-[#00a651] md:to-50%">
        
        {/* Left Side: Text & Search */}
        <div className="flex-1 pr-0 md:pr-5 mb-8 md:mb-0 w-full">
          <p className="text-[14px] text-[#555] mb-2.5">
            Order Restaurant food, takeaway and groceries.
          </p>
          <h1 className="text-[28px] md:text-[32px] text-[#222] mb-5 leading-tight font-bold">
            Taste the Best,
            <span className="block text-[#00a651]">Fresh Every Time</span>
          </h1>

          <div className="flex max-w-[400px] mt-[30px]">
            <input 
              type="text" 
              className="flex-1 px-[15px] py-3 border border-[#ddd] rounded-l-[25px] text-[14px] outline-none focus:ring-1 focus:ring-[#00a651]" 
              placeholder="Search for a restaurant" 
            />
            <button className="bg-[#2d5d46] text-white px-[25px] py-3 border-none rounded-r-[25px] font-medium hover:bg-[#234937] transition-colors">
              Search
            </button>
          </div>
        </div>

        {/* Right Side: Image */}
        <div className="flex-1 flex justify-center w-full">
          <img 
            src={logo} 
            alt="Food delivery illustration" 
            className="max-w-full h-auto md:h-[80%] object-contain"
          />
        </div>

      </div>
    </section>
  )
}

export default Hero