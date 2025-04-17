import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div className="font-sans bg-white text-black">
      {/* Navbar */}
      <nav className="bg-black text-white py-4">
        <div className="container mx-auto px-6 flex items-center justify-between">
          <h1 className="text-xl font-bold">HRCore</h1>
          <div className="flex gap-2">
            <Link
              to="/login"
              // className="bg-white text-black font-semibold px-4 py-2 rounded-lg"
            >
              <Button variant={"ghost"}>Login</Button>
            </Link>
            <Link
              to="/client/login"
              // className="bg-white text-black font-semibold px-4 py-2 rounded-lg"
            >
              <Button variant={"ghost"}>Client Login</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-black text-white py-16">
        <div className="container mx-auto text-center px-6">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Simplify Leave Management for Your Organization
          </h1>
          <p className="text-lg md:text-xl my-6">
            Empower tenants and employees with a streamlined leave management
            solution.
          </p>
          <Button variant={"secondary"} className="text-black">
            Get Started
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 bg-white">
        <div className="container mx-auto text-center px-6">
          <h2 className="text-3xl font-bold mb-8">Why Choose Us?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Tenant Management",
                description:
                  "Easily onboard and manage multiple tenants with secure access and custom configurations.",
              },
              {
                title: "Employee Portals",
                description:
                  "Provide employees with self-service tools for applying and tracking leaves.",
              },
              {
                title: "Leave Tracking",
                description:
                  "Stay on top of leave balances, approvals, and policies with real-time updates.",
              },
            ].map((feature, index) => (
              <Card key={index} className="shadow-lg border border-gray-300">
                <CardHeader className="font-semibold text-lg">
                  {feature.title}
                </CardHeader>
                <CardContent>{feature.description}</CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-16 bg-black text-white">
        <div className="container mx-auto text-center px-6">
          <h2 className="text-3xl font-bold mb-8">What Our Users Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Jane Doe",
                feedback:
                  "This platform has streamlined our leave management processes like never before.",
              },
              {
                name: "John Smith",
                feedback:
                  "A fantastic tool for managing employees and leaves. Highly recommended!",
              },
              {
                name: "Sarah Lee",
                feedback: "Super easy to use and efficient for HR teams.",
              },
            ].map((testimonial, index) => (
              <Card
                key={index}
                className="p-6 shadow-lg border border-gray-600 bg-gray-800"
              >
                <blockquote className="italic text-gray-200">
                  “{testimonial.feedback}”
                </blockquote>
                <footer className="mt-4 text-sm font-semibold text-gray-400">
                  - {testimonial.name}
                </footer>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call-to-Action Section */}
      <section id="signup" className="bg-gray-100 py-16">
        <div className="container mx-auto text-center px-6">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Transform Your Leave Management?
          </h2>
          <p className="text-lg mb-8">
            Sign up today and get started with our powerful HR tools.
          </p>
          <div className="flex justify-center gap-4">
            <Button className="bg-black text-white font-semibold px-6 py-3 rounded-lg shadow-lg">
              Sign Up Now
            </Button>
            <Button className="bg-gray-200 text-black px-6 py-3 rounded-lg shadow-lg hover:bg-white">
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="bg-black text-white py-8">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4">HRCore</h3>
              <p>Streamline your organization's leave management today.</p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Quick Links</h3>
              <ul>
                <li>
                  <a href="#features" className="hover:underline">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#testimonials" className="hover:underline">
                    Testimonials
                  </a>
                </li>
                <li>
                  <a href="#signup" className="hover:underline">
                    Sign Up
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Contact Us</h3>
              <p>Email: support@hrcore.com</p>
              <p>Phone: +2340088333</p>
            </div>
          </div>
          <div className="mt-8 text-center text-sm">
            © 2025 HRCore. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
