export default function DashboardLayout({ children }) {
    return (
        <div className="min-h-screen bg-gray-50 px-4 py-10">
            <div className="max-w-2xl mx-auto">{children}</div>
        </div>
    );
}
