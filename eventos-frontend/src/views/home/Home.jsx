import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button, Container, Grid, Header, Icon, Segment } from 'semantic-ui-react';
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
            <Segment
                vertical
                style={{
                    padding: '7em 0',
                    background: 'linear-gradient(135deg, #000000 0%, #0a192f 100%)',
                    color: '#fff',
                    textAlign: 'center',
                    borderBottom: '1px solid #1e293b'
                }}
            >
                <Container>
                    <Header
                        as='h1'
                        style={{
                            fontSize: '4em',
                            fontWeight: '800',
                            letterSpacing: '1px',
                            color: '#3b82f6'
                        }}
                    >
                        Events Stands
                    </Header>
                    <p style={{ fontSize: '1.5em', color: '#e0e0e0', maxWidth: '700px', margin: '0 auto', marginTop: '1em' }}>
                        Descubra espaços tecnológicos para exposições inesquecíveis. Conecte ideias e oportunidades em ambientes de alto padrão.
                    </p>
                    <Button
                        as={Link}
                        to="/stands"
                        size='huge'
                        style={{
                            marginTop: '2.5em',
                            backgroundColor: '#3b82f6',
                            color: '#fff',
                            padding: '1em 2.5em',
                            fontSize: '1.2em',
                            fontWeight: '600'
                        }}
                        animated='fade'
                    >
                        <Button.Content visible>Explorar Stands</Button.Content>
                        <Button.Content hidden>
                            <Icon name='arrow right' />
                        </Button.Content>
                    </Button>
                </Container>
            </Segment>

            {/* Propagandas dos Stands */}
            <Segment vertical style={{ padding: '5em 0', backgroundColor: '#0f172a' }}>
                <Container>
                    <Grid columns={3} stackable textAlign="center" divided>
                        <Grid.Row>
                            <Grid.Column>
                                <motion.div {...iconHover}>
                                    <Icon name='shop' size='huge' style={{ color: '#3b82f6' }} />
                                </motion.div>
                                <Header as='h3' style={{ color: '#fff', marginTop: '0.5em' }}>
                                    Reserve seu Stand!
                                </Header>
                                <p style={{ color: '#cbd5e1' }}>
                                    Garanta seu espaço no próximo evento e destaque seu negócio. Vagas limitadas, visibilidade garantida!
                                </p>
                            </Grid.Column>

                            <Grid.Column>
                                <motion.div {...iconHover}>
                                    <Icon name='calendar check' size='huge' style={{ color: '#3b82f6' }} />
                                </motion.div>
                                <Header as='h3' style={{ color: '#fff', marginTop: '0.5em' }}>
                                    Exponha com Facilidade
                                </Header>
                                <p style={{ color: '#cbd5e1' }}>
                                    Layouts prontos, infraestrutura completa e suporte. Você só chega, monta e vende.
                                </p>
                            </Grid.Column>

                            <Grid.Column>
                                <motion.div {...iconHover}>
                                    <Icon name='star outline' size='huge' style={{ color: '#3b82f6' }} />
                                </motion.div>
                                <Header as='h3' style={{ color: '#fff', marginTop: '0.5em' }}>
                                    Visibilidade Premium
                                </Header>
                                <p style={{ color: '#cbd5e1' }}>
                                    Seu stand em destaque com nossa vitrine digital. Mais olhos no seu produto, mais chances de fechar negócios.
                                </p>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Container>
            </Segment>

            {/* Footer */}
            <Segment inverted vertical style={{ padding: '3em 0', backgroundColor: '#000000', borderTop: '1px solid #1e293b' }}>
                <Container textAlign='center'>
                    <Grid stackable>
                        <Grid.Row>
                            <Grid.Column width={16}>
                                <Header as='h4' style={{ color: '#3b82f6' }}>Events Stands © 2025</Header>
                                <p style={{ color: '#94a3b8' }}>
                                    Conectando espaços e expositores com tecnologia e eficiência.
                                </p>
                                <p style={{ color: '#94a3b8' }}>
                                    contato@eventsstands.com.br | +55 (81) 99999-0000
                                </p>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Container>
            </Segment>
        </div>
    );
}
