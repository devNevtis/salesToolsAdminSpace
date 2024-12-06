const Logo = ({ className }) => (
    <svg viewBox="0 0 1200 250" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M0 200 Q100 200,100 100 Q100 0,200 0 L1000 0 Q1100 0,1100 100 Q1100 200,1200 200" fill="#224F5A"/>
      <circle cx="150" cy="100" r="8" fill="#29ABE2"/>
      <circle cx="180" cy="100" r="8" fill="#29ABE2"/>
      <circle cx="210" cy="100" r="8" fill="#29ABE2"/>
      <text x="300" y="150" fontSize="120" fontWeight="bold" fill="#224F5A">DialTools</text>
      <text x="950" y="100" fontSize="60" fill="#F25C05">Pro</text>
    </svg>
  );
  
  export default Logo;