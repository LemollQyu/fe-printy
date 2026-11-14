"use client";

import { useState } from "react";
import Botanical from "../../components/popup/Botanical";

export default function ContohPemakaian() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button onClick={() => setOpen(true)}>Buka pop up</button>

      <Botanical open={open} onClose={() => setOpen(false)}>
        {/* isi sendiri di sini */}
      </Botanical>
    </>
  );
}
