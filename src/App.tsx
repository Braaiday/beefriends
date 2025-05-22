import { BrowserRouter, Route, Routes } from "react-router-dom";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route index element={<>Hi There!</>} />
          <Route path="*" element={<>Page Not Found</>} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
