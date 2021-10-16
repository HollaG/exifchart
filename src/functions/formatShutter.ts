export default function formatShutter (shutterDenom: number|string)  { 
    const numified = Number(shutterDenom)
    if (Number.isNaN(numified)) return "Unknown"
    const rounded = Math.round(numified * 10) / 10
    if (rounded === 1) { 
        return `1"`
    } else if (rounded === 0) { 
        return `Unknown`
    } else if (rounded < 4) { 
        return `${Math.round(10 / rounded) / 10}"`
    } else return `1/${rounded}`
}