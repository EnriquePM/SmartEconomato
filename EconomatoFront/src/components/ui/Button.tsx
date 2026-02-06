interface ButtonProps {
  text: string;
  onClick?: () => void;
}

export const Button = ({ text, onClick }: ButtonProps) => (
  <button 
    onClick={onClick}
    className="w-full bg-black text-white font-bold py-4 rounded-full hover:bg-gray-800 transition-colors mt-4"
  >
    {text}
  </button>
);