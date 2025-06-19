"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, MapPin, Music, Users, X } from 'lucide-react'
import ModernButton from "./modern-button"

interface FilterProps {
  onFilterChange?: (filters: any) => void
}

export default function ModernFilter({ onFilterChange }: FilterProps) {
  const [activeFilters, setActiveFilters] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [regionFilter, setRegionFilter] = useState("all")
  const [sessionFilter, setSessionFilter] = useState("all")
  const [genreFilter, setGenreFilter] = useState("all")

  const removeFilter = (filter: string) => {
    setActiveFilters(prev => prev.filter(f => f !== filter))
  }

  const addFilter = (filter: string) => {
    if (!activeFilters.includes(filter)) {
      setActiveFilters(prev => [...prev, filter])
    }
  }

  return (
    <div className="space-y-4">
      {/* Main Filter Card */}
      <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="밴드명, 장르, 지역을 검색해보세요..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-3 border-0 bg-gray-50 rounded-xl text-sm placeholder:text-gray-500 focus:bg-white focus:ring-2 focus:ring-orange-500/20 transition-all"
            />
          </div>

          {/* Filter Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Region Filter */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-gray-700">
                <MapPin className="h-4 w-4 mr-2 text-orange-500" />
                지역
              </label>
              <Select value={regionFilter} onValueChange={setRegionFilter}>
                <SelectTrigger className="border-0 bg-gray-50 rounded-xl hover:bg-white transition-colors focus:ring-2 focus:ring-orange-500/20">
                  <SelectValue placeholder="지역 선택" />
                </SelectTrigger>
                <SelectContent className="border-0 shadow-xl rounded-xl">
                  <SelectItem value="all">전체 지역</SelectItem>
                  <SelectItem value="서울">서울</SelectItem>
                  <SelectItem value="부산">부산</SelectItem>
                  <SelectItem value="대구">대구</SelectItem>
                  <SelectItem value="인천">인천</SelectItem>
                  <SelectItem value="대전">대전</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Session Filter */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-gray-700">
                <Users className="h-4 w-4 mr-2 text-orange-500" />
                세션 타입
              </label>
              <Select value={sessionFilter} onValueChange={setSessionFilter}>
                <SelectTrigger className="border-0 bg-gray-50 rounded-xl hover:bg-white transition-colors focus:ring-2 focus:ring-orange-500/20">
                  <SelectValue placeholder="세션 선택" />
                </SelectTrigger>
                <SelectContent className="border-0 shadow-xl rounded-xl">
                  <SelectItem value="all">전체 세션</SelectItem>
                  <SelectItem value="정기">정기 세션</SelectItem>
                  <SelectItem value="단발">단발 세션</SelectItem>
                  <SelectItem value="공연">공연 준비</SelectItem>
                  <SelectItem value="연습">연습 모임</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Genre Filter */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-gray-700">
                <Music className="h-4 w-4 mr-2 text-orange-500" />
                장르
              </label>
              <Select value={genreFilter} onValueChange={setGenreFilter}>
                <SelectTrigger className="border-0 bg-gray-50 rounded-xl hover:bg-white transition-colors focus:ring-2 focus:ring-orange-500/20">
                  <SelectValue placeholder="장르 선택" />
                </SelectTrigger>
                <SelectContent className="border-0 shadow-xl rounded-xl">
                  <SelectItem value="all">전체 장르</SelectItem>
                  <SelectItem value="록">록</SelectItem>
                  <SelectItem value="재즈">재즈</SelectItem>
                  <SelectItem value="포크">포크</SelectItem>
                  <SelectItem value="펑크">펑크</SelectItem>
                  <SelectItem value="인디">인디</SelectItem>
                  <SelectItem value="일렉트로닉">일렉트로닉</SelectItem>
                  <SelectItem value="클래식">클래식</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 opacity-0">액션</label>
              <div className="flex space-x-2">
                <ModernButton variant="primary" className="flex-1">
                  검색
                </ModernButton>
                <ModernButton variant="outline" size="md">
                  초기화
                </ModernButton>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Active Filters */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {activeFilters.map((filter, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="px-3 py-1 bg-orange-100 text-orange-800 border border-orange-200 rounded-full hover:bg-orange-200 transition-colors"
            >
              {filter}
              <button
                onClick={() => removeFilter(filter)}
                className="ml-2 hover:text-orange-900"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}
