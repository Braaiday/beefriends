import { Icon } from "@iconify/react";

export const Footer = () => {
  return (
    <footer className="py-12 px-4 bg-card relative border-t border-border mt-12 pt-8 flex flex-wrap justify-between items-center">


      <p className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} BeeFriends. All rights reserved.</p>

      <a
        href="#hero"
        className="ml-auto p-2 rounded-full bg-primary/10 hover:bg-primary/20 text-primary transition-colors flex items-center gap-2"
      >
        <Icon icon="mdi:arrow-up" width={20} height={20} />

      </a>

    </footer>
  );
};
