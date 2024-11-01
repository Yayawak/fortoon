'use client';

import React from 'react';
import { motion } from 'framer-motion';

const Footer = () => (
  <motion.footer
    initial={{ opacity: 0 }}
    whileInView={{ opacity: 1 }}
    transition={{ duration: 0.8 }}
    viewport={{ once: true }}
    className="bg-gray-800 text-white py-6 md:py-8 px-4"
  >
    <div className="container mx-auto text-center">
      <p> 2024 Fortoon. For educational purposes only.</p>
    </div>
  </motion.footer>
);

export default Footer; 