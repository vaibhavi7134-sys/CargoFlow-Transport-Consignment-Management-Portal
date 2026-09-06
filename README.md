# 🚚 CargoFlow – Transport & Consignment Management Portal

CargoFlow is a modern, responsive enterprise frontend application designed for transportation and logistics service providers. It digitizes the booking workflow, automates commercial freight rate calculations, provides live shipment tracking with milestone timelines, and features an integrated AI logistics assistant.

---

## 🌟 Key Features

- **📊 Interactive Analytics Dashboard:**
  - Dynamic greeting with live date and revenue summary.
  - Key performance indicator stat cards (Orders, Total Revenue, Avg Items/Consignment) with SVG sparklines.
  - Conic-gradient donut chart visualizing order status distribution (*Booked*, *In Transit*, *Delivered*).
  - Recent shipments quick-table and 1-click action tiles.

- **📦 4-Step Consignment Booking Wizard:**
  - Step progress indicator (*General & Customer* → *Parties (Consignor/Consignee)* → *Cargo & Pricing* → *Review & Confirm*).
  - Automatic real-time valuation (`Quantity × Rate = Total Amount`).
  - Invoice-style review summary card before submission.
  - **⚡ Auto-Fill Demo Data** button for instant testing.
  - Form validation with descriptive error indicators.

- **📋 Consignment Management & Records Table:**
  - Status filter tabs (*All*, *Booked*, *In Transit*, *Delivered*) with live count badges.
  - Multi-column sorting (Date, Total Amount, Docket #).
  - Search filter across docket numbers, customer names, and cargo items.
  - **📥 Export to CSV** functionality for log archiving.
  - **📄 Consignment Note / Receipt Modal** with instant **🖨 Print** support.
  - Persistent data storage in browser `localStorage`.

- **📍 Live Consignment Tracking:**
  - Search by docket number with quick-selection chips of active orders.
  - Visual Origin-to-Destination corridor routing.
  - 5-stage milestone timeline (*Booked* → *Inbound Scan* → *High Priority Transit* → *Hub Arrival* → *Delivered*).

- **🤖 AI Support Assistant (CargoBot):**
  - Floating chat launcher with pulsating status indicator.
  - Smart keyword recognition engine: parses docket numbers to fetch real-time shipment status, rates, and routing.
  - Interactive suggested replies and navigation action buttons.
  - Session chat history retention.

- **🌗 Dark Mode & Full Responsiveness:**
  - Collapsible sidebar on desktop (260px) and tablet rail (68px).
  - Slide-in mobile drawer and fixed bottom navigation bar for mobile devices.
  - Seamless Light / Dark theme toggle with persistence in `localStorage`.

---

## 🛠️ Technology Stack

- **Framework:** React 19
- **Build Tool:** Vite
- **Styling:** Modern Vanilla CSS (CSS Variables, Flexbox, CSS Grid)
- **State & Storage:** React Hooks (`useState`, `useMemo`, `useCallback`, `useEffect`), Browser `localStorage` & `sessionStorage`
- **Typography:** Inter (Google Fonts)

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn

### Installation & Local Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/vaibhavi7134-sys/CargoFlow-Transport-Consignment-Management-Portal.git
   cd CargoFlow-Transport-Consignment-Management-Portal
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```
   Open your browser at `http://localhost:5173/`.

4. **Build for production:**
   ```bash
   npm run build
   ```

---

## 📄 License
This project is open-source and available under the MIT License.
