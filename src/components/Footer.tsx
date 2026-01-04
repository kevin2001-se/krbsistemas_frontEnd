import { motion } from "motion/react"

export default function Footer() {
    return (
        <motion.footer className="bg-primary text-center py-7" 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            viewport={{ once: true }}>
            <span className="text-white font-medium text-xl block">KRBSistemas | {new Date().getFullYear()} | By Kevin Blas</span>
        </motion.footer>
    )
}
