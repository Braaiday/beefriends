export const JoinSection = () => {
    return (
        <section
            id="join"
            className="py-20 text-primary-foreground relative z-10 flex flex-col items-center px-4"
        >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center opacity-0 animate-fade-in">
                Ready to Buzz In?
            </h2>
            <p className="max-w-xl text-center mb-4 opacity-0 animate-fade-in-delay-1">
                Sign up, find your crew, and start chatting in your favorite hives.
            </p>
            <p className="max-w-xl text-center mb-8 opacity-0 animate-fade-in-delay-1 text-sm">
                Already part of the hive?{" "}
                <a
                    href="/login"
                    className="text-accent underline hover:text-accent-dark"
                >
                    Log in here
                </a>
                .
            </p>

            <a
                href="/signup"
                className="cosmic-button opacity-0 animate-fade-in-delay-2"
            >
                Join the Hive
            </a>
        </section>
    );
};
