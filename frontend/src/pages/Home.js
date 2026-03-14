import { Link } from "react-router-dom";
import {
    FiSearch,
    FiBriefcase,
    FiUsers,
    FiTrendingUp,
    FiArrowRight,
    FiCheckCircle,
} from "react-icons/fi";

const Home = () => {
    return (
        <div className="min-h-screen bg-gray-50">

            {/* Hero Section */}
            <section className="bg-white border-b border-gray-200">
                <div className="max-w-6xl mx-auto px-4 py-20">
                    <div className="text-center max-w-3xl mx-auto">

                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-full text-sm font-medium mb-6">
                            <FiCheckCircle />
                            Trusted by 10,000+ professionals
                        </div>

                        <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
                            Find Your Next
                            <span className="text-blue-600"> Dream Job</span>
                            <br />
                            With JobConnect
                        </h1>

                        <p className="text-xl text-gray-500 mb-10">
                            Connect with top companies and discover thousands of
                            opportunities tailored just for you
                        </p>

                        {/* Search Bar */}
                        <div className="flex bg-white border-2 border-gray-200 rounded-xl overflow-hidden shadow-sm hover:border-blue-400 transition max-w-2xl mx-auto">
                            <div className="flex items-center px-4 text-gray-400">
                                <FiSearch className="text-xl" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search jobs, companies, skills..."
                                className="flex-1 py-4 px-2 text-gray-800 outline-none text-base"
                            />
                            <Link
                                to="/jobs"
                                className="bg-blue-600 text-white px-8 py-4 font-semibold hover:bg-blue-700 transition flex items-center gap-2"
                            >
                                Search
                                <FiArrowRight />
                            </Link>
                        </div>

                        {/* Quick Stats */}
                        <div className="flex justify-center gap-8 mt-10 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                                <FiCheckCircle className="text-green-500" />
                                1000+ Jobs Available
                            </span>
                            <span className="flex items-center gap-1">
                                <FiCheckCircle className="text-green-500" />
                                500+ Companies
                            </span>
                            <span className="flex items-center gap-1">
                                <FiCheckCircle className="text-green-500" />
                                Free to Use
                            </span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-16 bg-blue-600">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                        <div className="text-white">
                            <FiBriefcase className="text-5xl mx-auto mb-4 text-blue-200" />
                            <h3 className="text-4xl font-bold">1000+</h3>
                            <p className="text-blue-200 mt-2 text-lg">Jobs Available</p>
                        </div>
                        <div className="text-white">
                            <FiUsers className="text-5xl mx-auto mb-4 text-blue-200" />
                            <h3 className="text-4xl font-bold">500+</h3>
                            <p className="text-blue-200 mt-2 text-lg">Companies Hiring</p>
                        </div>
                        <div className="text-white">
                            <FiTrendingUp className="text-5xl mx-auto mb-4 text-blue-200" />
                            <h3 className="text-4xl font-bold">10,000+</h3>
                            <p className="text-blue-200 mt-2 text-lg">Successful Placements</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* How it works */}
            <section className="py-16 bg-white border-b border-gray-200">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900">
                            How JobConnect Works
                        </h2>
                        <p className="text-gray-500 mt-3 text-lg">
                            Get started in 3 simple steps
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                step: "01",
                                title: "Create Account",
                                desc: "Sign up as a job seeker or recruiter in minutes",
                                color: "bg-blue-50 text-blue-600",
                            },
                            {
                                step: "02",
                                title: "Search or Post Jobs",
                                desc: "Browse thousands of jobs or post your openings",
                                color: "bg-green-50 text-green-600",
                            },
                            {
                                step: "03",
                                title: "Apply or Hire",
                                desc: "Apply with one click or find your perfect candidate",
                                color: "bg-purple-50 text-purple-600",
                            },
                        ].map((item) => (
                            <div
                                key={item.step}
                                className="text-center p-8 rounded-2xl border border-gray-100 hover:shadow-md transition"
                            >
                                <div
                                    className={`text-4xl font-black mb-4 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto ${item.color}`}
                                >
                                    {item.step}
                                </div>
                                <h3 className="text-xl font-bold text-gray-800 mb-2">
                                    {item.title}
                                </h3>
                                <p className="text-gray-500">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Categories */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900">
                            Browse by Category
                        </h2>
                        <p className="text-gray-500 mt-3">
                            Explore jobs in your field of expertise
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            { name: "Technology", count: "234 jobs", emoji: "💻" },
                            { name: "Marketing", count: "123 jobs", emoji: "📢" },
                            { name: "Design", count: "89 jobs", emoji: "🎨" },
                            { name: "Finance", count: "156 jobs", emoji: "💰" },
                            { name: "Healthcare", count: "201 jobs", emoji: "🏥" },
                            { name: "Education", count: "78 jobs", emoji: "📚" },
                            { name: "Engineering", count: "167 jobs", emoji: "⚙️" },
                            { name: "Sales", count: "145 jobs", emoji: "📈" },
                        ].map((category) => (
                            <Link
                                key={category.name}
                                to="/jobs"
                                className="bg-white p-6 rounded-xl text-center shadow-sm hover:shadow-md hover:border-blue-500 border-2 border-transparent transition group"
                            >
                                <div className="text-3xl mb-2">{category.emoji}</div>
                                <p className="font-semibold text-gray-700 group-hover:text-blue-600 transition">
                                    {category.name}
                                </p>
                                <p className="text-gray-400 text-sm mt-1">{category.count}</p>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 bg-white border-t border-gray-200">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                        Are You a Recruiter?
                    </h2>
                    <p className="text-gray-500 mb-8 text-lg">
                        Post jobs for free and find the best talent for your company today
                    </p>
                    <div className="flex justify-center gap-4">
                        <Link
                            to="/register"
                            className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition text-lg flex items-center gap-2"
                        >
                            Post a Job
                            <FiArrowRight />
                        </Link>
                        <Link
                            to="/jobs"
                            className="bg-gray-100 text-gray-700 px-8 py-3 rounded-xl font-bold hover:bg-gray-200 transition text-lg"
                        >
                            Browse Jobs
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-10">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="flex items-center gap-2">
                            <div className="bg-blue-600 p-2 rounded-lg">
                                <FiBriefcase className="text-white" />
                            </div>
                            <span className="text-xl font-bold">
                                Job<span className="text-blue-400">Connect</span>
                            </span>
                        </div>
                        <p className="text-gray-400 text-sm">
                            © 2025 JobConnect. Connecting talent with opportunity.
                        </p>
                        <div className="flex gap-6 text-gray-400 text-sm">
                            <Link to="/" className="hover:text-white transition">Home</Link>
                            <Link to="/jobs" className="hover:text-white transition">Jobs</Link>
                            <Link to="/register" className="hover:text-white transition">Register</Link>
                        </div>
                    </div>
                </div>
            </footer>

        </div>
    );
};

export default Home;