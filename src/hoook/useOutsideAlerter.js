import { useEffect } from 'react';

export default function useOutsideAlerter(ref, setShowDropdown) {
    useEffect(() => {
        function handleClickOutside(event) {
            if (ref.current && !ref.current.contains(event.target)) {
                setShowDropdown(false);
            }
        }

        document.addEventListener("click", handleClickOutside);
        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, [ref, setShowDropdown]);
}
