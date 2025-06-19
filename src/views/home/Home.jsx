import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { motion } from "framer-motion";
import { CalendarCheck, MonitorPlay, Star } from 'lucide-react';
import MenuSistema from "../../MenuSistema";

function cardStyle(color1, color2) {
    return {
        background: `linear-gradient(135deg, ${color1}, ${color2})`,
        borderRadius: 24,
        padding: 30,
        color: '#fff',
        boxShadow: `0 0 30px ${color1}88`,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        zIndex: 1,
        position: 'relative',
        backdropFilter: 'blur(10px)'
    };
}

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

            {/* Carrossel de Stands */}
            <section style={{ backgroundColor: '#0f172a', padding: '4em 0' }}>
                <div className="container">
                    <div id="carouselTecnologia" className="carousel slide" data-bs-ride="carousel">
                        <div className="carousel-inner rounded-4 overflow-hidden shadow-lg">
                            {/* Slide 1 */}
                            <div className="carousel-item active position-relative">
                                <img src="/tech.png" className="d-block w-100" alt="Stand 1" style={{ maxHeight: 500, objectFit: 'cover', filter: 'brightness(0.6)' }} />
                                <div className="carousel-caption d-flex flex-column justify-content-center align-items-center h-100">
                                    <motion.h5 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} style={{ fontSize: '2.2em', fontWeight: 'bold' }}>
                                        Tecnologia de Ponta
                                    </motion.h5>
                                    <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} style={{ fontSize: '1.2em', maxWidth: 600 }}>
                                        Stands com automação, LED e conexão total.
                                    </motion.p>
                                    <motion.button
                                        whileHover={{ scale: 1.05, backgroundColor: '#2563eb' }}
                                        whileTap={{ scale: 0.95 }}
                                        transition={{ duration: 0.2 }}
                                        className="mt-3"
                                        style={{
                                            backgroundColor: '#3b82f6',
                                            border: 'none',
                                            borderRadius: 28,
                                            padding: '0.8em 2em',
                                            fontSize: 18,
                                            fontWeight: 600,
                                            color: '#fff',
                                            cursor: 'pointer',
                                            boxShadow: '0 0 20px #1e40af77'
                                        }}
                                        onClick={() => window.location.href = '/tecnologia'}
                                    >
                                        Explorar Stands
                                    </motion.button>
                                </div>
                            </div>

                            {/* Slide 2 */}
                            <div className="carousel-item position-relative">
                                <img src="/stand2.jpg" className="d-block w-100" alt="Stand 2" style={{ maxHeight: 500, objectFit: 'cover', filter: 'brightness(0.6)' }} />
                                <div className="carousel-caption d-flex flex-column justify-content-center align-items-center h-100">
                                    <motion.h5 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} style={{ fontSize: '2.2em', fontWeight: 'bold' }}>
                                        Design Futurista
                                    </motion.h5>
                                    <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} style={{ fontSize: '1.2em', maxWidth: 600 }}>
                                        Ambientes que encantam e convertem clientes.
                                    </motion.p>
                                    <motion.button
                                        whileHover={{ scale: 1.05, backgroundColor: '#2563eb' }}
                                        whileTap={{ scale: 0.95 }}
                                        transition={{ duration: 0.2 }}
                                        className="mt-3"
                                        style={{
                                            backgroundColor: '#3b82f6',
                                            border: 'none',
                                            borderRadius: 28,
                                            padding: '0.8em 2em',
                                            fontSize: 18,
                                            fontWeight: 600,
                                            color: '#fff',
                                            cursor: 'pointer',
                                            boxShadow: '0 0 20px #1e40af77'
                                        }}
                                        onClick={() => window.location.href = '/design'}
                                    >
                                        Explorar Stands
                                    </motion.button>
                                </div>
                            </div>

                            {/* Slide 3 */}
                            <div className="carousel-item position-relative">
                                <img src="/ime2.jpg" className="d-block w-100" alt="Stand 3" style={{ maxHeight: 500, objectFit: 'cover', filter: 'brightness(0.6)' }} />
                                <div className="carousel-caption d-flex flex-column justify-content-center align-items-center h-100">
                                    <motion.h5 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} style={{ fontSize: '2.2em', fontWeight: 'bold' }}>
                                        Interatividade Imersiva
                                    </motion.h5>
                                    <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} style={{ fontSize: '1.2em', maxWidth: 600 }}>
                                        Experiências digitais que geram resultados.
                                    </motion.p>
                                    <motion.button
                                        whileHover={{ scale: 1.05, backgroundColor: '#2563eb' }}
                                        whileTap={{ scale: 0.95 }}
                                        transition={{ duration: 0.2 }}
                                        className="mt-3"
                                        style={{
                                            backgroundColor: '#3b82f6',
                                            border: 'none',
                                            borderRadius: 28,
                                            padding: '0.8em 2em',
                                            fontSize: 18,
                                            fontWeight: 600,
                                            color: '#fff',
                                            cursor: 'pointer',
                                            boxShadow: '0 0 20px #1e40af77'
                                        }}
                                        onClick={() => window.location.href = '/imersao'}
                                    >
                                        Explorar Stands
                                    </motion.button>
                                </div>
                            </div>
                        </div>

                        {/* Controles */}
                        <button className="carousel-control-prev" type="button" data-bs-target="#carouselTecnologia" data-bs-slide="prev">
                            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                            <span className="visually-hidden">Anterior</span>
                        </button>
                        <button className="carousel-control-next" type="button" data-bs-target="#carouselTecnologia" data-bs-slide="next">
                            <span className="carousel-control-next-icon" aria-hidden="true"></span>
                            <span className="visually-hidden">Próximo</span>
                        </button>
                    </div>
                </div>
            </section>

            {/* Sobre Nós */}
            <section style={{ background: 'linear-gradient(to right, #0f172a, #0a192f)', padding: '6em 0', color: '#fff', position: 'relative', overflow: 'hidden' }}>
                <div className="container text-center">
                    <motion.h2
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        style={{ fontSize: '3em', fontWeight: '800', color: '#3b82f6', marginBottom: '1em' }}
                    >
                        Sobre Nós
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                        style={{ fontSize: '1.3em', maxWidth: 800, margin: '0 auto', color: '#cbd5e1' }}
                    >
                        Somos movidos pela inovação. Transformamos espaços em experiências, conectando marcas e pessoas através da tecnologia.
                    </motion.p>

                    <div className="row mt-5">
                        {/* Card 1 */}
                        <motion.div className="col-md-4 p-3"
                            whileHover={{ scale: 1.05, rotateX: 5, rotateY: 5 }}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3, duration: 0.6, type: 'spring' }}
                        >
                            <div style={cardStyle('#1e40af', '#2563eb')}>
                                <motion.div animate={{ scale: [1, 1.15, 1], rotate: [0, 10, -10, 0] }} transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}>
                                    <CalendarCheck size={64} color="#fff" style={{ marginBottom: 20 }} />
                                </motion.div>
                                <h4>Reserve seu Stand</h4>
                                <p>Plataforma simples, intuitiva e digital para garantir seu espaço com agilidade.</p>
                            </div>
                        </motion.div>

                        {/* Card 2 */}
                        <motion.div className="col-md-4 p-3"
                            whileHover={{ scale: 1.05, rotateX: -5, rotateY: 5 }}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5, duration: 0.6, type: 'spring' }}
                        >
                            <div style={cardStyle('#0ea5e9', '#3b82f6')}>
                                <motion.div animate={{ scale: [1, 1.1, 1], y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 3 }}>
                                    <MonitorPlay size={64} color="#fff" style={{ marginBottom: 20 }} />
                                </motion.div>
                                <h4>Exponha com Facilidade</h4>
                                <p>Gerencie conteúdos, telas e interações digitais direto do painel do expositor.</p>
                            </div>
                        </motion.div>

                        {/* Card 3 */}
                        <motion.div className="col-md-4 p-3"
                            whileHover={{ scale: 1.05, rotateX: 5, rotateY: -5 }}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.7, duration: 0.6, type: 'spring' }}
                        >
                            <div style={cardStyle('#10b981', '#14b8a6')}>
                                <motion.div animate={{ rotate: [0, 20, -20, 0] }} transition={{ repeat: Infinity, duration: 6 }}>
                                    <Star size={64} color="#fff" style={{ marginBottom: 20 }} />
                                </motion.div>
                                <h4>Visibilidade Premium</h4>
                                <p>Seu stand em destaque com localização privilegiada e tecnologias de projeção.</p>
                            </div>
                        </motion.div>
                    </div>

                    {/* Efeito de fundo */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0.05, 0.1, 0.05] }}
                        transition={{ duration: 6, repeat: Infinity }}
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            backgroundImage: 'radial-gradient(#3b82f6 1px, transparent 1px)',
                            backgroundSize: '40px 40px',
                            zIndex: 0
                        }}
                    />
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
                    &copy; 2025 - Projeto e Prática II - IFPE Jaboatão dos Guararapes
                </p>
            </div>
        </footer>
    );
}
