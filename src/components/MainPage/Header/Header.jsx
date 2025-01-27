import { useState } from "react"
import './Header.css'
import SearchInput from "../SearchInput/SearchInput"
import PersonalAccountButton from "../PersonalAccountButton/PersonalAccountButton"

export default function Header({ onSearchChange }) {
    const [now, setNow] = useState(new Date())
    setInterval(()=> setNow(new Date()), 1000)

    return (
    <header>
        <PersonalAccountButton/>
        <SearchInput onSearchChange={onSearchChange}/>
        <span>Сейчас: {now.toLocaleTimeString()}</span>
    </header>
    )
}