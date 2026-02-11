interface ButtonProps {
  text: string;
  onClick?: () => void;
}

export const Button = ({ text, onClick }: ButtonProps) => (
  <button 
    onClick={onClick}
    className="w-full bg-primario text-white font-bold py-4 rounded-pill hover:opacity-90 transition-all mt-4 active:scale-[0.98]"
  >
    {text}
  </button>
);