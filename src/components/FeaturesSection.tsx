import { Icon } from "@iconify/react";

const features = [
    {
        icon: "mdi:chat",
        title: "Hive Chat Rooms",
        description: "Jump into buzzing chat rooms to connect and share with your fellow bees.",
    },
    {
        icon: "mdi:account-multiple-plus",
        title: "Add Bee Buddies",
        description: "Make new friends and keep your hive growing strong.",
    },
    {
        icon: "mdi:crown",
        title: "Queen Bee Admins",
        description: "Create private groups and assign queen bees to manage the hive.",
    },
];

export const FeaturesSection = () => {
    return (
        <section id="features" className="py-20 relative z-10">
            <div className="container max-w-5xl mx-auto px-4 text-center">
                <h2 className="text-3xl md:text-4xl font-bold mb-12 opacity-0 animate-fade-in">
                    Buzzing Features to Keep You Connected
                </h2>

                <div className="grid md:grid-cols-3 gap-10">
                    {features.map(({ icon, title, description }, i) => (
                        <div
                            key={title}
                            className="p-6 rounded-lg bg-card shadow-md hover:shadow-lg transition-shadow duration-300 cursor-default opacity-0"
                            style={{ animation: `fade-in 0.7s ease-out forwards`, animationDelay: `${i * 0.3}s` }}
                        >
                            <div className="text-primary mb-4">
                                <Icon icon={icon} className="w-12 h-12 mx-auto" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">{title}</h3>
                            <p className="text-muted-foreground">{description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
