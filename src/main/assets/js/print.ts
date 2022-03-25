// This is needed as the inline print script violates the Content Security Policy
const printLink = document.getElementById('print') as HTMLElement | null;
if (printLink) {
  printLink.onclick = function () {
    window.print();
   }
}