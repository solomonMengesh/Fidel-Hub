import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { GraduationCap, BookOpen, Users, Globe, Award } from "lucide-react";
import ThemeToggle from "@/components/ui/ThemeToggle";

function About() {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-900">
      <div className="flex-1 pt-24 pb-12">
        {/* Hero section */}
        <div className="relative overflow-hidden bg-gradient-to-r from-fidel-500 to-fidel-700 py-20 md:py-28">
          <div className="absolute -top-40 -left-40 w-80 h-80 bg-fidel-100 dark:bg-fidel-950/20 rounded-full blur-3xl opacity-60 dark:opacity-30 -z-10"></div>
          <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-slate-100 dark:bg-slate-800/20 rounded-full blur-3xl opacity-60 dark:opacity-30 -z-10"></div>

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                About Fidel Hub
              </h1>
              <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto">
                Empowering education through technology and innovation in
                Ethiopia and beyond.
              </p>
            </motion.div>
          </div>
        </div>

        {/* Mission and vision */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl py-16 md:py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
                Our Mission
              </h2>
              <p className="text-muted-foreground">
                At Fidel Hub, our mission is to democratize education by
                providing accessible, high-quality learning experiences to
                students across Ethiopia. We believe that education is the
                cornerstone of development, and we are committed to empowering
                individuals to reach their full potential through innovative
                learning solutions.
              </p>
              <p className="text-muted-foreground">
                We strive to bridge educational gaps, foster a culture of
                continuous learning, and build a community where knowledge is
                shared freely and equitably.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
                Our Vision
              </h2>
              <p className="text-muted-foreground">
                We envision a future where every Ethiopian has access to quality
                education regardless of their location, background, or economic
                status. Fidel Hub aims to be the leading educational platform in
                Ethiopia, known for innovation, inclusivity, and excellence.
              </p>
              <p className="text-muted-foreground">
                By harnessing the power of technology, we seek to transform the
                educational landscape, creating opportunities for lifelong
                learning and professional development that contribute to the
                nation's growth and prosperity.
              </p>
            </motion.div>
          </div>
        </div>

        {/* Our values */}
        <div className="bg-slate-50 dark:bg-slate-800/30 py-16 md:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
                Our Core Values
              </h2>
              <p className="text-muted-foreground max-w-3xl mx-auto">
                These principles guide everything we do at Fidel Hub, shaping
                our culture and our approach to education.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  icon: <GraduationCap className="h-10 w-10 text-fidel-500" />,
                  title: "Excellence",
                  description:
                    "We are committed to the highest standards of academic integrity and quality in all our offerings.",
                },
                {
                  icon: <BookOpen className="h-10 w-10 text-fidel-500" />,
                  title: "Accessibility",
                  description:
                    "We believe education should be accessible to all, regardless of physical location or economic background.",
                },
                {
                  icon: <Users className="h-10 w-10 text-fidel-500" />,
                  title: "Community",
                  description:
                    "We foster a supportive community where students and instructors collaborate and grow together.",
                },
                {
                  icon: <Globe className="h-10 w-10 text-fidel-500" />,
                  title: "Innovation",
                  description:
                    "We continuously explore new technologies and methodologies to enhance the learning experience.",
                },
              ].map((value, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * (index + 1) }}
                  viewport={{ once: true }}
                  className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col items-center text-center"
                >
                  <div className="mb-4">{value.icon}</div>
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                    {value.title}
                  </h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Team section */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl py-16 md:py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
              Our Team
            </h2>
            <p className="text-muted-foreground max-w-3xl mx-auto">
              Meet the passionate educators and technologists behind Fidel Hub
              who are dedicated to transforming education in Ethiopia.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Abebe Bekele",
                role: "Founder & CEO",
                bio: "Abebe has over 15 years of experience in education and technology, with a passion for expanding educational access across Ethiopia.",
                avatar: "AB",
              },
              {
                name: "Tigist Haile",
                role: "Chief Academic Officer",
                bio: "Tigist brings her extensive background in curriculum development to ensure our courses meet the highest academic standards.",
                avatar: "TH",
              },
              {
                name: "Solomon Tadesse",
                role: "CTO",
                bio: "Solomon leads our technical team, implementing innovative solutions that make learning accessible and engaging for all users.",
                avatar: "ST",
              },
              {
                name: "Liya Abera",
                role: "Head of Student Success",
                bio: "Liya works to ensure that every student receives the support they need to achieve their educational goals.",
                avatar: "LA",
              },
              {
                name: "Dawit Melaku",
                role: "Content Director",
                bio: "Dawit collaborates with top instructors to create courses that are both rigorous and relevant to the Ethiopian context.",
                avatar: "DM",
              },
              {
                name: "Hirut Bekele",
                role: "Community Manager",
                bio: "Hirut builds and nurtures our learning community, facilitating connections between students and instructors.",
                avatar: "HB",
              },
            ].map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * (index + 1) }}
                viewport={{ once: true }}
                className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="h-20 w-20 rounded-full bg-fidel-100 dark:bg-fidel-900 text-fidel-500 flex items-center justify-center text-xl font-bold mb-4">
                    {member.avatar}
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-1">
                    {member.name}
                  </h3>
                  <p className="text-fidel-500 font-medium mb-3">
                    {member.role}
                  </p>
                  <p className="text-muted-foreground">{member.bio}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Call to action */}
        <div className="bg-fidel-500 dark:bg-fidel-600 text-white py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <h2 className="text-3xl font-bold mb-6">
                Join Our Educational Journey
              </h2>
              <p className="text-lg mb-8 max-w-3xl mx-auto">
                Whether you're a student eager to learn, an instructor
                passionate about teaching, or an institution looking to expand
                your reach, Fidel Hub welcomes you to be part of our educational
                community.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  to="/courses"
                  className="bg-white text-fidel-500 hover:bg-slate-100 px-6 py-3 rounded-md font-medium transition-colors"
                >
                  Explore Courses
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-6 right-6 z-50">
        <ThemeToggle />
      </div>
    </div>
  );
}

export default About;
