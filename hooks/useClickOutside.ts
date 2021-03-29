import React, { MutableRefObject } from "react";
function useClickOutside<T extends HTMLElement>(ref: MutableRefObject<T>, except: MutableRefObject<any>, callback: () => void) {
    React.useEffect(() => {
        function handleClickOutside(event: Event) {
            if (
                ref.current &&
                !ref.current.contains(event.target as Node) &&
                except?.current &&
                !except?.current.contains(event.target)
            ) {
                callback();
                return;
            }
            if (ref.current && !ref.current.contains(event.target as Node) && !except) {
                callback();
                return;
            }
        }
        // Bind the event listener
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [ref, callback, except]);
}

export default useClickOutside;