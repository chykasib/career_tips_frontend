import Carousel from "@/components/Carousel";
import { motion } from "framer-motion";

const Home = () => {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const stagger = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
  };

  return (
    <div>
      {/* Hero Section */}
      <motion.section
        className="hero min-h-screen bg-base-200 flex items-center justify-center"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        <div className="text-center">
          <motion.h1
            className="text-5xl font-bold text-primary"
            variants={fadeIn}
          >
            Unlock Your Career Potential
          </motion.h1>
          <motion.p className="py-6" variants={fadeIn}>
            Discover tools, blogs, and inspiring stories to guide your journey
            to success.
          </motion.p>
          <motion.a
            href="/career-tools"
            className="btn btn-primary"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Get Started Now
          </motion.a>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section
        className="py-8 bg-gray-50"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={stagger}
      >
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">
            Features Designed for You
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Career Tools",
                description:
                  "Use templates, trackers, and resources to boost your professional growth.",
                link: "/career-tools",
              },
              {
                title: "Blogs",
                description:
                  "Gain insights and tips from career experts to excel in your field.",
                link: "/blogs",
              },
              {
                title: "Community Stories",
                description:
                  "Learn from real stories of success and challenges overcome.",
                link: "/community-stories",
              },
            ].map((feature, index) => (
              <motion.div
                className="card bg-white shadow-xl"
                key={index}
                variants={fadeIn}
              >
                <div className="card-body">
                  <h3 className="card-title">{feature.title}</h3>
                  <p>{feature.description}</p>
                  <a href={feature.link} className="btn btn-primary">
                    Learn More
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Testimonials Section */}
      <motion.section
        className="py-12 bg-primary text-white"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={stagger}
      >
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">
            What People Are Saying
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                text: `"The tools and blogs have helped me land my dream job. Highly recommend!"`,
                author: "- Jane Doe",
              },
              {
                text: `"I love the community stories—they keep me motivated to keep pushing forward."`,
                author: "- John Smith",
              },
              {
                text: `"Career Tips is a one-stop destination for everything I need to succeed."`,
                author: "- Alice Johnson",
              },
            ].map((testimonial, index) => (
              <motion.div
                className="testimonial bg-white text-black p-6 rounded-lg shadow-lg"
                key={index}
                variants={fadeIn}
              >
                <p>{testimonial.text}</p>
                <p className="mt-4 font-bold">{testimonial.author}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Newsletter Signup Section */}
      <motion.section
        className="py-12 bg-gray-50"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeIn}
      >
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
          <p className="mb-6">
            Sign up for our newsletter to receive the latest tips and updates.
          </p>
          <form className="flex flex-col md:flex-row justify-center items-center gap-4">
            <motion.input
              type="email"
              placeholder="Enter your email"
              className="input input-bordered w-full max-w-xs"
              whileFocus={{ scale: 1.05 }}
            />
            <motion.button
              className="btn btn-primary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Subscribe
            </motion.button>
          </form>
        </div>
      </motion.section>
      <Carousel />
    </div>
  );
};

export default Home;
