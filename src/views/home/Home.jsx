import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import MenuSistema from "../../MenuSistema";

export default function Home() {
    const iconHover = {
        whileHover: { scale: 1.2, rotate: 3 },
        transition: { type: 'spring', stiffness: 300 },
    };

    return (
        <div style={{ backgroundColor: '#0a192f', color: '#ffffff' }}>
            <MenuSistema tela={'Home'} />

            {/* Hero */}
            <section
                style={{
                    padding: '7em 0',
                    background: 'linear-gradient(135deg, #000000 0%, #0a192f 100%)',
                    color: '#fff',
                    textAlign: 'center',
                    borderBottom: '1px solid #1e293b'
                }}
            >
                <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 2em' }}>
                    <h1
                        style={{
                            fontSize: '4em',
                            fontWeight: '800',
                            letterSpacing: '1px',
                            color: '#3b82f6',
                            margin: 0
                        }}
                    >
                        Events Stands
                    </h1>
                    <p style={{ fontSize: '1.5em', color: '#e0e0e0', maxWidth: '700px', margin: '0 auto', marginTop: '1em' }}>
                        Descubra espaços tecnológicos para exposições inesquecíveis. Conecte ideias e oportunidades em ambientes de alto padrão.
                    </p>
                    <motion.button
                        as={Link}
                        whileHover={{ scale: 1.05, backgroundColor: '#2563eb' }}
                        whileTap={{ scale: 0.97 }}
                        style={{
                            marginTop: '2.5em',
                            backgroundColor: '#3b82f6',
                            color: '#fff',
                            padding: '1em 2.5em',
                            fontSize: '1.2em',
                            fontWeight: '600',
                            border: 'none',
                            borderRadius: 32,
                            cursor: 'pointer',
                            boxShadow: '0 2px 12px #1e293b33',
                            transition: 'background 0.2s',
                            outline: 'none',
                            textDecoration: 'none',
                            display: 'inline-block'
                        }}
                        onClick={() => window.location.href = '/stands'}
                    >
                        Explorar Stands <span style={{ marginLeft: 12, fontSize: 22 }}>→</span>
                    </motion.button>
                </div>
            </section>

            {/* Propagandas dos Stands */}
            <section style={{ padding: '5em 0', backgroundColor: '#0f172a' }}>
                <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 2em' }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 32, justifyContent: 'center', textAlign: 'center' }}>
                        <div style={{ flex: '1 1 300px', minWidth: 260, maxWidth: 350 }}>
                            <motion.div {...iconHover}>
                                <span style={{ fontSize: 60, color: '#3b82f6', display: 'inline-block', marginBottom: 8, cursor: 'pointer' }}>🏬</span>
                            </motion.div>
                            <h3 style={{ color: '#fff', marginTop: '0.5em', fontSize: 26, fontWeight: 700 }}>Reserve seu Stand!</h3>
                            <p style={{ color: '#cbd5e1', fontSize: 17 }}>
                                Garanta seu espaço no próximo evento e destaque seu negócio. Vagas limitadas, visibilidade garantida!
                            </p>
                        </div>
                        <div style={{ flex: '1 1 300px', minWidth: 260, maxWidth: 350 }}>
                            <motion.div {...iconHover}>
                                <span style={{ fontSize: 60, color: '#3b82f6', display: 'inline-block', marginBottom: 8, cursor: 'pointer' }}>📅</span>
                            </motion.div>
                            <h3 style={{ color: '#fff', marginTop: '0.5em', fontSize: 26, fontWeight: 700 }}>Exponha com Facilidade</h3>
                            <p style={{ color: '#cbd5e1', fontSize: 17 }}>
                                Layouts prontos, infraestrutura completa e suporte. Você só chega, monta e vende.
                            </p>
                        </div>
                        <div style={{ flex: '1 1 300px', minWidth: 260, maxWidth: 350 }}>
                            <motion.div {...iconHover}>
                                <span style={{ fontSize: 60, color: '#3b82f6', display: 'inline-block', marginBottom: 8, cursor: 'pointer' }}>⭐</span>
                            </motion.div>
                            <h3 style={{ color: '#fff', marginTop: '0.5em', fontSize: 26, fontWeight: 700 }}>Visibilidade Premium</h3>
                            <p style={{ color: '#cbd5e1', fontSize: 17 }}>
                                Seu stand em destaque com nossa vitrine digital. Mais olhos no seu produto, mais chances de fechar negócios.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
        </div>
    );
}

export function Footer() {
    return (
        <footer style={{ padding: '3em 0', backgroundColor: '#000000', borderTop: '1px solid #1e293b', textAlign: 'center' }}>
            <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 2em' }}>
                <h4 style={{ color: '#3b82f6', fontWeight: 700, fontSize: 22, marginBottom: 8 }}>Events Stands</h4>
                <p style={{ color: '#94a3b8', fontSize: 16 }}>
                    Conectando espaços e expositores com tecnologia e eficiência.
                </p>
                <p style={{ color: '#94a3b8', fontSize: 16 }}>
                    contato@eventsstands.com.br | +55 (81) 99999-0000
                </p>
                <p style={{ color: '#94a3b8', fontSize: 16 }}>
                    &copy; 2025 - Projeto e Pratica II - IFPE Jaboatão dos Guararapes
                </p>
            </div>
        </footer>
    );
}
