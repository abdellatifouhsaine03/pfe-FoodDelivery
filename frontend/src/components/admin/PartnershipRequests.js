"use client"

import { useEffect, useState } from "react"
import RequestTable from "./RequestTable"
import DetailModal from "./DetailModal"
import axios from "axios"
import { Search, Filter, PlusCircle, Users, Store } from "lucide-react"

const PartnershipRequests = () => {
  const [activeTab, setActiveTab] = useState("rider")
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [newRequestsOnly, setNewRequestsOnly] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState(null)

  const [riderRequests, setriderRequests] = useState([])
  const [restaurantRequests, setrestaurantRequests] = useState([])

  useEffect(() => {
    axios.get("http://localhost:8000/api/riders/pending")
      .then((res) => setriderRequests(res.data))
      .catch((err) => console.error("Error loading riders:", err))
  }, [])

  useEffect(() => {
    axios.get("http://localhost:8000/api/restaurants/pending")
      .then((res) => setrestaurantRequests(res.data))
      .catch((err) => console.error("Error loading restaurants:", err))
  }, [])

  const handleViewDetails = (request) => setSelectedRequest(request)
  const handleCloseModal = () => setSelectedRequest(null)
  const handleApprove = (id) => { console.log("Approve:", id); setSelectedRequest(null); }
  const handleReject = (id) => { console.log("Reject:", id); setSelectedRequest(null); }

  return (
    <div className="space-y-6">
      {/* HEADER SECTION */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2 p-1 bg-slate-200/50 rounded-2xl w-fit">
          <button
            onClick={() => setActiveTab("rider")}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-black transition-all ${
              activeTab === "rider" 
              ? "bg-white text-emerald-600 shadow-sm" 
              : "text-slate-500 hover:text-slate-700"
            }`}
          >
            <Users size={18} />
            Rider Applications
          </button>
          <button
            onClick={() => setActiveTab("restaurant")}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-black transition-all ${
              activeTab === "restaurant" 
              ? "bg-white text-emerald-600 shadow-sm" 
              : "text-slate-500 hover:text-slate-700"
            }`}
          >
            <Store size={18} />
            Restaurant Applications
          </button>
        </div>

        <label className="flex items-center gap-3 cursor-pointer group">
          <div className="relative flex items-center">
            <input
              type="checkbox"
              className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-slate-300 transition-all checked:border-emerald-500 checked:bg-emerald-500"
              checked={newRequestsOnly}
              onChange={(e) => setNewRequestsOnly(e.target.checked)}
            />
            <span className="absolute text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" stroke="currentColor" strokeWidth="1"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
            </span>
          </div>
          <span className="text-sm font-bold text-slate-600 group-hover:text-slate-900">New Requests Only</span>
        </label>
      </div>

      {/* SEARCH AND FILTERS BAR */}
      <div className="flex flex-col gap-4 md:flex-row">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
          <input
            type="text"
            placeholder="Search by name, email or ID..."
            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 transition-all font-medium text-slate-700 shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="relative">
          <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <select
            className="pl-12 pr-10 py-3 bg-white border border-slate-200 rounded-2xl outline-none focus:border-emerald-500 appearance-none font-bold text-sm text-slate-700 shadow-sm cursor-pointer"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* TABLE CONTAINER */}
      <div className="bg-white border border-slate-200 rounded-[2rem] overflow-hidden shadow-sm">
        <RequestTable
          requests={activeTab === "rider" ? riderRequests : restaurantRequests}
          type={activeTab}
          onViewDetails={handleViewDetails}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      </div>

      {/* MODAL */}
      {selectedRequest && (
        <DetailModal
          request={selectedRequest}
          type={activeTab}
          onClose={handleCloseModal}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      )}
    </div>
  )
}

export default PartnershipRequests