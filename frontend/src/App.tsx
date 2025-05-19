/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import styled from 'styled-components';

// Simulação de pedidos e chats (exemplo)
const pedidos = [
  { id: 1, nome: 'Pedido 1', cliente: 'cliente1@fakenotexist.com' },
  { id: 2, nome: 'Pedido 2', cliente: 'cliente2@fakenotexist.com' }
];

const chats = [
  { id: 1, pedidoId: 1, title: 'Chat - Pedido 1' },
  { id: 2, pedidoId: 2, title: 'Chat - Pedido 2' }
];

// Estilos
const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  min-width: 100vw;
  font-family: 'Arial', sans-serif;
`;

const Header = styled.header`
  background-color: #007bff;
  color: white;
  padding: 1rem;
  text-align: center;
`;

const Content = styled.div`
  display: flex;
  flex: 1;
  padding: 1rem;
  background-color: #f4f4f4;
`;

const Sidebar = styled.div`
  width: 250px;
  background-color: #fff;
  margin-right: 1rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 1rem;
`;

const ListTitle = styled.h2`
  color: #333;
`;

const List = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const ListItem = styled.li`
  padding: 0.5rem;
  background-color: #fff;
  margin-bottom: 0.5rem;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #f0f0f0;
  }
`;

const ChatContent = styled.div`
  flex: 1;
  background-color: #fff;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Button = styled.button`
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;

const App: React.FC = () => {
  const [selectedPedidoId, setSelectedPedidoId] = useState<number | null>(null);
  const [showChat, setShowChat] = useState(false);

  const selectedPedido = pedidos.find(p => p.id === selectedPedidoId);
  const selectedChat = chats.find(c => c.pedidoId === selectedPedidoId);

  return (
    <Container>
      <Header>
        <h1>Gestor de Pedidos</h1>
      </Header>
      <Content>
        <Sidebar>
          <ListTitle>Pedidos</ListTitle>
          <PedidoList pedidos={pedidos} setSelectedPedidoId={setSelectedPedidoId} setShowChat={setShowChat} />
        </Sidebar>
        <ChatContent>
          {selectedPedido ? (
            <>
              <h2>{selectedPedido.nome}</h2>
              <p>Cliente: {selectedPedido.cliente}</p>
              {!showChat ? (
                <Button onClick={() => setShowChat(true)}>Abrir chat</Button>
              ) : (
                <ChatComponent chat={selectedChat} />
              )}
            </>
          ) : (
            <p>Selecione um pedido</p>
          )}
        </ChatContent>
      </Content>
    </Container>
  );
};

const PedidoList = ({ pedidos, setSelectedPedidoId, setShowChat }: any) => (
  <List>
    {pedidos.map((pedido: any) => (
      <ListItem key={pedido.id} onClick={() => {
        setSelectedPedidoId(pedido.id);
        setShowChat(false);
      }}>
        {pedido.nome}
      </ListItem>
    ))}
  </List>
);

const ChatComponent = ({ chat }: any) => {
  if (!chat) return <p>Chat não encontrado.</p>;

  return (
    <div>
      <h3>{chat.title}</h3>
      <p>Aqui vai o conteúdo do chat...</p>
    </div>
  );
};

export default App;
