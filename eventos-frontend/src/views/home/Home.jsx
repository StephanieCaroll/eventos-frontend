import React from "react";
import { Container, Grid, Header, Button, Segment } from 'semantic-ui-react';
import MenuSistema from "../../MenuSistema";

export default function Home() {
    return (
        <div>
            {/* MenuSistema atualizado */}
            <MenuSistema tela={'Home'} />

            {/* Conteúdo principal */}
            <Container style={{ marginTop: '5%', textAlign: 'center' }}>
                <Header as='h1' style={{ color: '#000', fontSize: '3em', fontWeight: 'bold', marginTop: '100px' }}>
                    Bem-Vindo ao Events Stands
                </Header>

                <Grid columns={1} centered>
                    <Grid.Row>
                        <Grid.Column verticalAlign='middle' style={{ marginTop: '10px' }}>
                            <p>junte-se a nós para uma experiência inesquecível</p>
                            <Button color='blue' size='large' style={{ marginTop: '20px' }}>
                                Veja os Stands
                            </Button>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Container>

            <Segment vertical style={{ padding: '5%', textAlign: 'center' }}>
                <Container>
                    <Grid columns={3} stackable textAlign="center">
                        <Grid.Row>
                            <Grid.Column>
                                <Header as='h3'>Localização</Header>
                                   <p>Em desenvolvimento...</p>
                            </Grid.Column>
                            <Grid.Column>
                                <Header as='h3'>Data e Horário</Header>
                                   <p>Em desenvolvimento...</p>
                            </Grid.Column>
                            <Grid.Column>
                                <Header as='h3'>Stands em Destaque</Header>
                                <p>Em desenvolvimento...</p>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Container>
            </Segment>
        </div>
    );
}
