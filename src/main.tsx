import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)


//  {/* Select Dropdown */}
//  <Select onValueChange={onChange}>
//  <SelectTrigger className="w-full p-2 border rounded bg-white">
//    <SelectValue placeholder={placeholder} />
//  </SelectTrigger>

//  <SelectContent className="w-full bg-white border rounded shadow">
//    {/* Search Input inside the dropdown */}
//    <div className="p-2">
//      <Input
//        type="text"
//        value={search}
//        onChange={(e) => setSearch(e.target.value)}
//        placeholder="Search..."
//        className="w-full p-2 border-b focus:outline-none"
//      />
//    </div>

//    {/* Loading or No options message */}
//    {loading ? (
//      <p className="p-2 text-gray-500">Loading...</p>
//    ) : (
//      <div className="max-h-40 overflow-y-auto">
//        {options.length > 0 ? (
//          options.map((option) => (
//            <SelectItem
//              key={option.value}
//              value={option.value}
//              onClick={() => {
//                setSearch(option.value);
//              }}
//            >
//              {option.label}
//            </SelectItem>
//          ))
//        ) : (
//          <p className="p-2 text-gray-500">No options found</p>
//        )}
//      </div>
//    )}
//  </SelectContent>
// </Select>