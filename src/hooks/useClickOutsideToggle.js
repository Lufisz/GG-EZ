import { useEffect, useRef, useState } from "react";

// Custom hook to toggle state based on clicks outside a referenced element
const useClickOutsideToggle = () => {
  const [expanded, setExpanded] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    // Function to handle clicks outside the referenced element
    const handleClickOutside = (event) => {
      // Check if the click is outside the referenced element
      if (ref.current && !ref.current.contains(event.target)) {
        setExpanded(false);
      }
    };

    // Add a mouseup event listener to the document
    document.addEventListener("mouseup", handleClickOutside);
    // Cleanup: Remove the event listener on unmount
    return () => {
      document.removeEventListener("mouseup", handleClickOutside);
    };
  }, [ref]);

  // Return expanded state, setter function, and the reference to the component
  return { expanded, setExpanded, ref };
};

export default useClickOutsideToggle;