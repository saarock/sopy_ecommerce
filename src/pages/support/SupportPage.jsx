import React, { useState } from 'react';
import { Mail, Phone, MessageSquare, Send, HelpCircle, ArrowRight } from 'lucide-react';
import { toast } from 'react-toastify';

const SupportPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            toast.success("Message sent successfully! Our team will contact you soon.");
            setFormData({ name: '', email: '', subject: '', message: '' });
            setLoading(false);
        }, 1500);
    };

    const faqs = [
        { q: "How do I cancel my order?", a: "You can cancel your order within 1 hour of booking from your dashboard under 'My Products' section." },
        { q: "How to update inventory?", a: "Admins can update stock levels from the 'Manage Products' page in the admin dashboard." },
        { q: "Can I use it on mobile?", a: "Yes, Stock-Zen is fully responsive and works on all mobile devices." },
        { q: "Is there an API available?", a: "Yes, we provide enterprice-grade APIs for seamless integration with other platforms." }
    ];

    return (
        <div className="min-h-screen bg-gray-50 pt-12 pb-24 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold text-[#101540] mb-4">How can we help?</h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Whether you have a question about features, pricing, or anything else, our team is ready to answer all your questions.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Contact Information */}
                    <div className="lg:col-span-1 space-y-8">
                        <div className="bg-white p-8 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100">
                            <h2 className="text-2xl font-bold text-[#101540] mb-8">Contact Information</h2>

                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                                        <Mail size={24} />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-900">Email us</p>
                                        <p className="text-gray-600">support@stockzen.com</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-green-50 text-green-600 rounded-xl">
                                        <Phone size={24} />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-900">Call us</p>
                                        <p className="text-gray-600">+1 (555) 000-0000</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
                                        <MessageSquare size={24} />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-900">Live Chat</p>
                                        <p className="text-gray-600">Available 24/7</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-12 pt-8 border-t border-gray-100">
                                <h3 className="font-bold text-[#101540] mb-4">Follow us</h3>
                                <div className="flex gap-4">
                                    {['Twitter', 'LinkedIn', 'Github'].map(platform => (
                                        <a key={platform} href="#" className="text-sm text-blue-500 hover:underline">{platform}</a>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Quick FAQ Snippet */}
                        <div className="bg-gradient-to-br from-[#101540] to-[#1a2158] p-8 rounded-3xl text-white shadow-xl">
                            <HelpCircle className="w-10 h-10 mb-6 opacity-50" />
                            <h3 className="text-xl font-bold mb-4">Quick help?</h3>
                            <p className="text-white/80 mb-6">Check our extensive documentation and community forums for instant answers.</p>
                            <button className="flex items-center gap-2 font-semibold hover:gap-3 transition-all">
                                Go to Knowledge Base <ArrowRight size={18} />
                            </button>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="lg:col-span-2">
                        <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100">
                            <h2 className="text-2xl font-bold text-[#101540] mb-8">Send us a message</h2>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700">Your Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#101540] focus:border-transparent outline-none transition-all"
                                            placeholder="John Doe"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700">Email Address</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#101540] focus:border-transparent outline-none transition-all"
                                            placeholder="john@example.com"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">Subject</label>
                                    <input
                                        type="text"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#101540] focus:border-transparent outline-none transition-all"
                                        placeholder="How can we help?"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">Message</label>
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        rows={6}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#101540] focus:border-transparent outline-none transition-all resize-none"
                                        placeholder="Detailed description of your inquiry..."
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full md:w-auto px-12 py-4 bg-[#101540] text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#1a2158] hover:shadow-lg transition-all disabled:opacity-50"
                                >
                                    {loading ? "Sending..." : "Send Message"}
                                    {!loading && <Send size={18} />}
                                </button>
                            </form>
                        </div>

                        {/* Popular FAQs Section */}
                        <div className="mt-16">
                            <h2 className="text-2xl font-bold text-[#101540] mb-8">Frequently Asked Questions</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {faqs.map((faq, i) => (
                                    <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                                        <h3 className="font-bold text-gray-900 mb-2">{faq.q}</h3>
                                        <p className="text-gray-600 text-sm">{faq.a}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SupportPage;
