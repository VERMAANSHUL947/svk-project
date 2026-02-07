export const categories = {
    ac: {
        name: "AC, Appliance & Repair",
        subcategories: [
            { name: "AC Service & Repair", icon: "❄️", route: "/ac-repair" },
            { name: "Refrigerator Repair", icon: "🧊", route: "/appliance" },
            { name: "Washing Machine Repair", icon: "🧺", route: "/appliance" },
            { name: "Microwave Repair", icon: "🔥", route: "/appliance" },
            { name: "TV Repair", icon: "📺", route: "/appliance" }
        ]
    },
    electrician: {
        name: "Electrician, Plumber & Carpenter",
        subcategories: [
            { name: "Electrician", icon: "💡", route: "/electrician" },
            { name: "Plumber", icon: "🚿", route: "/plumber" },
            { name: "Carpenter", icon: "🪑", route: "/services/carpenter" },
            { name: "Painter", icon: "🎨", route: "/services/painter" },
            { name: "Mason", icon: "🧱", route: "/services/mason" }
        ]
    },
    cleaning: {
        name: "Cleaning, Pest Control & Safety",
        subcategories: [
            { name: "Home Cleaning", icon: "🧹", route: "/services/home-cleaning" },
            { name: "Pest Control", icon: "🦗", route: "/services/pest-control" },
            { name: "Sanitization", icon: "🧼", route: "/services/sanitization" },
            { name: "Home Security", icon: "🛡️", route: "/services/home-security" },
            { name: "CCTV Installation", icon: "📹", route: "/services/cctv" }
        ]
    },
    renovation: {
        name: "Home Renovation & Interior",
        subcategories: [
            { name: "Interior Design", icon: "🏠", route: "/services/interior-design" },
            { name: "Home Renovation", icon: "🔨", route: "/services/home-renovation" },
            { name: "Modular Kitchen", icon: "🍽️", route: "/services/modular-kitchen" },
            { name: "Wallpaper", icon: "🖼️", route: "/services/wallpaper" },
            { name: "Flooring", icon: "🪵", route: "/services/flooring" }
        ]
    },
    fabrication: {
        name: "Fabrication, Grills & Roofing",
        subcategories: [
            { name: "Metal Fabrication", icon: "🏗️", route: "/services/metal-fabrication" },
            { name: "Window Grills", icon: "🪟", route: "/services/window-grills" },
            { name: "Roofing", icon: "🏠", route: "/services/roofing" },
            { name: "Gate Installation", icon: "🚪", route: "/services/gate-installation" },
            { name: "Railing Work", icon: "🪜", route: "/services/railing" }
        ]
    },
    beauty: {
        name: "Women's Beauty & Spa",
        subcategories: [
            { name: "Salon at Home", icon: "💇‍♀️", route: "/services/salon-at-home" },
            { name: "Spa Services", icon: "🧖‍♀️", route: "/services/spa-services" },
            { name: "Bridal Makeup", icon: "💄", route: "/services/bridal-makeup" },
            { name: "Hair Styling", icon: "✂️", route: "/services/hair-styling" },
            { name: "Facial", icon: "💆‍♀️", route: "/services/facial" }
        ]
    },
    grooming: {
        name: "Men's Grooming & Massage",
        subcategories: [
            { name: "Haircut & Styling", icon: "💈", route: "/services/men-haircut" },
            { name: "Beard Grooming", icon: "🧔", route: "/services/beard-grooming" },
            { name: "Massage", icon: "💆‍♂️", route: "/services/men-massage" },
            { name: "Facial", icon: "🧖‍♂️", route: "/services/men-facial" },
            { name: "Spa", icon: "🧴", route: "/services/men-spa" }
        ]
    },
    homecare: {
        name: "Home Care, Support & Logistics",
        subcategories: [
            { name: "Packers & Movers", icon: "🚚", route: "/services/packers-movers" },
            { name: "Home Nursing", icon: "👩‍⚕️", route: "/services/home-nursing" },
            { name: "Elderly Care", icon: "👴", route: "/services/elderly-care" },
            { name: "Baby Care", icon: "👶", route: "/services/baby-care" },
            { name: "Laundry Services", icon: "👗", route: "/services/laundry" }
        ]
    },
    security: {
        name: "Home Security, Solar & Water",
        subcategories: [
            { name: "Solar Panel", icon: "☀️", route: "/services/solar-panel" },
            { name: "Water Purifier", icon: "💧", route: "/services/water-purifier" },
            { name: "CCTV", icon: "📹", route: "/services/cctv-security" },
            { name: "Smart Locks", icon: "🔒", route: "/services/smart-locks" },
            { name: "Home Automation", icon: "📱", route: "/services/home-automation" }
        ]
    }
};
