document.querySelector("#calculate").addEventListener("click", () => {
    const price = Number(document.querySelector("#price").value);
    const discount = Number(document.querySelector("#discount").value);

    const finalPrice = price - (price * discount / 100);

    document.querySelector("#total").textContent =
        `Precio final: ${finalPrice} €`;
});