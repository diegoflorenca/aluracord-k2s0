import { Box, Text, TextField, Image, Button } from '@skynexui/components';
import React from 'react';
import appConfig from '../config.json';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/router';
import { ButtonSendSticker } from '../src/components/ButtonSendSticker';

const SUPABASE_URL = 'https://rmpbcorzusgymvvulncf.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MzQwODUxNiwiZXhwIjoxOTU4OTg0NTE2fQ.OtFYIDdxk1Es5tNx2dJvtSRky5ogKF3kkG1gHDj9GcM';
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/*
 * A função escutaMensagensEmTempoReal recebe uma função como parâmetro 'adicionaMensagem'.
 * Dessa forma, é possível enviar o resultado do 'listener' do supabase, que é a mensagem
 * que acabamos de inserir, para a função que vai colocar essa mensagem no setter 'setListaDeMensagens',
 * que está dentro do 'useEffect'
 */
function escutaMensagensEmTempoReal(adicionaMensagem) {
	return supabaseClient
		.from('mensagens')
		.on('INSERT', (respostaLive) => {
			// console.log('Houve uma nova mensagem', oQueVeio);
			adicionaMensagem(respostaLive.new);
		})
		.subscribe();
}

export default function ChatPage() {
	// * Router para ter acesso a varivável da URL
	const roteamento = useRouter();
	// * Usuário logado
	const usuarioLogado = roteamento.query.username;
	// console.log('usuarioLogado: ', usuarioLogado);
	// * É importante sempre inicializar o useState com algum valor, mesmo que o valor seja vazio
	const [mensagem, setMensagem] = React.useState('');
	// const [listaDeMensagens, setListaDeMensagens] = React.useState([]);
	const [listaDeMensagens, setListaDeMensagens] = React.useState([
		// {
		// 	id: 1,
		// 	de: 'diegoflorenca',
		// 	texto: ':sticker: https://www.alura.com.br/imersao-react-4/assets/figurinhas/Figurinha_3.png',
		// },
		// {
		// 	id: 2,
		// 	de: 'omariosouto',
		// 	texto: 'O ternário é meio triste',
		// },
	]);

	/*
	 * Algo que não faz parte do fluxo padrão o useEffect foge da execução padrão do código pode ser executado em um dado momento ou como efeito de alteração de outro elemento. Se o dado demora um pouco para chegar ele não faz parte do fluxo padrão, e pode ser considerado um efeito colateral
	 */

	/*
	! DÙVIDA - O useEffect não deveria ser executado apelas uma vez? Quando a página é carregada.
	! Então como a funcão escutaMensagensEmTempoReal é executada sempre que uma nova mensagem é enviada?
	*/
	React.useEffect(() => {
		// Request dos dados do supabase
		supabaseClient
			.from('mensagens')
			.select('*')
			// * Ordena a query do mais novo para o mais antigo
			.order('created_at', { ascending: false })
			.then(({ data }) => {
				// console.log('Consulta de Dados: ', data);
				setListaDeMensagens(data);
			});
		escutaMensagensEmTempoReal((novaMensagem) => {
			console.log('Nova mensagem', novaMensagem);
			/*
			 * Para reutilizar um valor de referência (objeto ou array),
			 * e obter seu valor atual e não o inicial,
			 * é preciso passar uma função para o setState, neste caso,
			 * setListaDeMensagens(função)
			 */
			setListaDeMensagens((valorAtualDaLista) => {
				return [novaMensagem, ...valorAtualDaLista];
			});
		});
	}, []);

	/*
	* Usuário
	- Usuário digita no campo textarea
	- Aperta enter para enviar
	- Tem que adicionar o texto na listagem

	* Dev
	- [X] Criar o campo
	- [X] Vamos usar o onChange e o useState (ter if para caso seja enter para limpar a variável)
	- [X] Atualizar a lista de mensagens

	* DESAFIOS AULA 4
	- [ ] colorar um loading enquanto as mensagens estão baixando
	- [ ] Fazer um mouseover na imagem do usuário, passa o mouse e abre o perfil da pessoa usar a API do GITHUB
	- [ ] Além de mandar mensagens mandar pull, imagem, anexo etc.
  	*/

	function handleNovaMensagem(novaMensagem) {
		const mensagem = {
			// id: listaDeMensagens.length + 1,
			// de: 'vanessametonini',
			de: usuarioLogado,
			texto: novaMensagem,
		};

		supabaseClient
			.from('mensagens')
			// Precisa ser um objeto com os MESMOS CAMPOS presentes no supabase
			.insert([mensagem])
			.then(({ data }) => {
				// * Aula 05 - Essa função vai parar de atualizar a lista
				// console.log('Criando mensagem: ', data);
				// setListaDeMensagens([data[0], ...listaDeMensagens]);
			});

		setMensagem('');
	}

	return (
		<Box
			styleSheet={{
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				backgroundColor: appConfig.theme.colors.primary[500],
				backgroundImage: `url(https://www.teahub.io/photos/full/192-1920958_star-wars-rogue-one-k2so..jpg)`,
				backgroundRepeat: 'no-repeat',
				backgroundSize: 'cover',
				backgroundBlendMode: 'multiply',
				color: appConfig.theme.colors.neutrals['000'],
			}}
		>
			<Box
				styleSheet={{
					display: 'flex',
					flexDirection: 'column',
					flex: 1,
					boxShadow: '0 2px 10px 0 rgb(0 0 0 / 20%)',
					borderRadius: '5px',
					backgroundColor: appConfig.theme.colors.neutrals[700],
					height: '100%',
					maxWidth: '95%',
					maxHeight: '95vh',
					padding: '32px',
				}}
			>
				<Header />
				<Box
					styleSheet={{
						position: 'relative',
						display: 'flex',
						flex: 1,
						height: '80%',
						backgroundColor: appConfig.theme.colors.neutrals[600],
						flexDirection: 'column',
						borderRadius: '5px',
						padding: '16px',
					}}
				>
					{/* 
          É preciso passar a lista de mensagens e o setListaDeMensagens como parâmetro 
          para que a função MessageList consiga fazer a atualização da lista de 
          mensagens
          */}
					<MessageList mensagens={listaDeMensagens} setListaDeMensagens={setListaDeMensagens} />
					{/* {listaDeMensagens.map((mensagemAtual) => {
            return (
              <li key={mensagemAtual.id}>
                {mensagemAtual.de}: {mensagemAtual.texto}
              </li>
            );
          })} */}
					<Box
						as='form'
						styleSheet={{
							display: 'flex',
							alignItems: 'center',
						}}
					>
						{/* Callback */}
						<ButtonSendSticker
							onStickerClick={(sticker) => {
								// console.log('[USANDO O COMPONENTE] Salva esse sticker no banco', sticker);
								// console.log(':sticker:' + sticker);
								//handleNovaMensagem(':sticker: ' + sticker);
							}}
						/>
						<TextField
							value={mensagem}
							onChange={(event) => {
								const valor = event.target.value;
								setMensagem(valor);
							}}
							onKeyPress={(event) => {
								if (event.key === 'Enter') {
									event.preventDefault();
									handleNovaMensagem(mensagem);
								}
							}}
							placeholder='Insira sua mensagem aqui...'
							type='textarea'
							styleSheet={{
								width: '100%',
								border: '0',
								resize: 'none',
								borderRadius: '5px',
								padding: '6px 8px',
								backgroundColor: appConfig.theme.colors.neutrals[800],
								marginRight: '12px',
								color: appConfig.theme.colors.neutrals[200],
							}}
						/>
						<Button
							type='submit'
							label='Enviar'
							styleSheet={{ color: 'black' }}
							onClick={(event) => {
								event.preventDefault();
								if (mensagem != '') {
									handleNovaMensagem(mensagem);
								}
							}}
							buttonColors={{
								contrastColor: appConfig.theme.colors.neutrals['000'],
								mainColor: appConfig.theme.colors.primary[500],
								mainColorLight: appConfig.theme.colors.primary[400],
								mainColorStrong: appConfig.theme.colors.primary[600],
							}}
						/>
					</Box>
				</Box>
			</Box>
		</Box>
	);
}

function Header() {
	return (
		<>
			<Box styleSheet={{ width: '100%', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
				<Text variant='heading5'>Chat</Text>
				<Button variant='tertiary' colorVariant='neutral' label='Logout' href='/' />
			</Box>
		</>
	);
}
// props é um objeto com todos os atributos que estão presentes no componente
function MessageList(props) {
	//console.log('MessageList', props);
	function handlerRemoveMensagem(id) {
		const mensagensAtualizadas = props.mensagens.filter((mensagemAtual) => {
			return mensagemAtual.id != id;
		});
		// Com o props podemos acessar todos os parâmetros que foram passados para o MessageList
		props.setListaDeMensagens(mensagensAtualizadas);
	}
	return (
		<Box
			tag='ul'
			styleSheet={{
				overflowY: 'auto',
				display: 'flex',
				flexDirection: 'column-reverse',
				flex: 1,
				color: appConfig.theme.colors.neutrals['000'],
				marginBottom: '16px',
			}}
		>
			{props.mensagens.map((mensagem) => {
				return (
					<Text
						key={mensagem.id}
						tag='li'
						styleSheet={{
							borderRadius: '5px',
							padding: '6px',
							marginBottom: '12px',
							hover: {
								backgroundColor: appConfig.theme.colors.neutrals[700],
							},
						}}
					>
						<Box
							styleSheet={{
								marginBottom: '8px',
								display: 'flex',
								alignItems: 'center',
							}}
						>
							<Image
								styleSheet={{
									width: '20px',
									height: '20px',
									borderRadius: '50%',
									display: 'inline-block',
									marginRight: '8px',
								}}
								src={`https://github.com/${mensagem.de}.png`}
							/>
							<Text tag='strong'>{mensagem.de}</Text>
							<Text
								styleSheet={{
									fontSize: '10px',
									marginLeft: '8px',
									color: appConfig.theme.colors.neutrals[300],
								}}
								tag='span'
							>
								{/* {new Date().toLocaleDateString()} */}
								{mensagem.created_at}
							</Text>
							<Button
								type='submit'
								label='X'
								onClick={(event) => {
									event.preventDefault();
									handlerRemoveMensagem(mensagem.id);
								}}
								styleSheet={{
									marginLeft: 'auto',
									padding: '6px',
								}}
								buttonColors={{
									contrastColor: appConfig.theme.colors.neutrals['000'],
									mainColor: appConfig.theme.colors.neutrals[500],
									mainColorLight: appConfig.theme.colors.neutrals[400],
									mainColorStrong: appConfig.theme.colors.neutrals[600],
								}}
							/>
						</Box>
						{/* Se a mensagem possui stickers: mostra imagem, caso contrário, só mostra o texto */}
						{mensagem.texto.startsWith(':sticker:') ? <Image src={mensagem.texto.replace(':sticker:', '')} /> : mensagem.texto}
						{/* Se precisar de mais 'ifs' será necessário um outro método */}
					</Text>
				);
			})}
		</Box>
	);
}
