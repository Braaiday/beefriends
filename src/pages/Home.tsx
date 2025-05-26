import { FeaturesSection } from "../components/FeaturesSection"
import { Footer } from "../components/Footer"
import { GardenBackground } from "../components/GardenBackground"
import { HeroSection } from "../components/HeroSection"
import { JoinSection } from "../components/JoinSection"
import { Navbar } from "../components/Navbar"

export const Home = () => {
    return (
        <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
            {/* Navbar */}
            <Navbar />
            
            {/* Background Effects */}
            <GardenBackground />

            <main>
                <HeroSection />
                <FeaturesSection />
                <JoinSection />
            </main>

            <Footer />
        </div>
    )
}
