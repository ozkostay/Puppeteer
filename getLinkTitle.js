export default function getLinkTitle(els) {
  // return els.map((el) => {
  //   const spans = Array.from(el.querySelectorAll("span"));
  //   const spansText = spans.map((i) => i.innerText);
  //   return {
  //     href: el.getAttribute("href"),
  //     spans: spansText.join(" "),
  //   };
  // });
  return [{ href: "href", spans: "Name" }];
}
