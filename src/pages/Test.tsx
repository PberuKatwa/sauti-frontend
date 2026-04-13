import { useEffect, useRef, useState } from "react"

export default function Test() {

  // let [number, setNumber] = useState(0);

  // const handleClick = () => {
  //   const newNum = number++
  //   setNumber(newNum)
  // }

  const ref = useRef(0)
  const inputRef = useRef<HTMLInputElement | null>(null);

  // const handleClick = () => {
  //   ref.current++
  //   console.log("refff", ref.current)
  //   console.log("inputtt", inputRef)
  // }

  const handleClick = () => {
    if (inputRef.current) {
      inputRef.current.focus();
      inputRef.current.style.backgroundColor = "aqua"
    }
  }

  useEffect(
    () => { console.log("COMPONENTTTT MOUNTEDDDDD", ref.current) }
  )

  return (
    <div className="px-5 py-5">
      <button className="bg-indigo-600 ml-5 mt-5 px-5 py-5"  onClick={handleClick}>
        CLICK MEEEEE { ref.current}!!!!
      </button>
      <input ref={inputRef} />

    </div>
  )

}
