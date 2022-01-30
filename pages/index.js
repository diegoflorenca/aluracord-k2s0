import { Box, Button, Text, TextField, Image } from '@skynexui/components';
import appConfig from '../config.json';
import React from 'react';
import { useRouter } from 'next/router';

function Title(props) {
	const Tag = props.tag || 'h1';
	return (
		<>
			<Tag>{props.children}</Tag>
			<style jsx>{`
				${Tag} {
					color: ${appConfig.theme.colors.neutrals['000']};
					font-size: 24px;
					font-weight: 600;
				}
			`}</style>
		</>
	);
}

// Componente React
// function HomePage() {
//     // JSX
//     return (
//         <div>
//             <GlobalStyle />
//             <Title tag="h2">Boas vindas de volta!</Title>
//             <h2>Discord - Alura Matrix</h2>
//         </div>
//     )
// }
// export default HomePage

export default function PaginaInicial() {
	// const username = 'diegoflorenca';

	// Criação da variável username com seu Setter, inicializada com o valor 'diegoflorenca'
	const [username, setUsername] = React.useState('diegoflorenca');
	const [isDisabled, setIsDisabled] = React.useState(false);
	const roteamento = useRouter();

	return (
		<>
			<Box
				styleSheet={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					backgroundColor: appConfig.theme.colors.primary[500],
					backgroundImage: 'url(https://virtualbackgrounds.site/wp-content/uploads/2020/08/the-matrix-digital-rain.jpg)',
					backgroundRepeat: 'no-repeat',
					backgroundSize: 'cover',
					backgroundBlendMode: 'multiply',
				}}
			>
				<Box
					styleSheet={{
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'space-between',
						flexDirection: {
							xs: 'column',
							sm: 'row',
						},
						width: '100%',
						maxWidth: '700px',
						borderRadius: '5px',
						padding: '32px',
						margin: '16px',
						boxShadow: '0 2px 10px 0 rgb(0 0 0 / 20%)',
						backgroundColor: appConfig.theme.colors.neutrals[700],
					}}
				>
					{/* Formulário */}
					<Box
						as='form'
						onSubmit={function (infosDoEvento) {
							infosDoEvento.preventDefault();
							console.log('Alguém submeteu o form.');
							// Comportamento padrão do navegador (faz o recarregamento da página)
							// window.location.href = '/chat';

							// Troca de página pelo Router do next, passando o usuário como parâmetro
							roteamento.push(`/chat?username=${username}`);
						}}
						styleSheet={{
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
							justifyContent: 'center',
							width: { xs: '100%', sm: '50%' },
							textAlign: 'center',
							marginBottom: '32px',
						}}
					>
						<Title tag='h2'>Boas vindas de volta!</Title>
						<Text variant='body3' styleSheet={{ marginBottom: '32px', color: appConfig.theme.colors.neutrals[300] }}>
							{appConfig.name}
						</Text>

						<TextField
							value={username}
							onChange={function handler(event) {
								// Onde está o valor?
								const valor = event.target.value;
								// Troca o valor da variável através do React e avise quem precisa saber
								setUsername(valor);

								// DESAFIO: Impedir o submit do form se o username tiver menos de duas letras
								// Verifica se o username possui mais do que 2 letras
								const usernameStatus = valor.length <= 2 ? true : false;

								// Modifica a variável de controle do botão dependendo do tamanho do username
								setIsDisabled(usernameStatus);
							}}
							fullWidth
							textFieldColors={{
								neutral: {
									textColor: appConfig.theme.colors.neutrals[200],
									mainColor: appConfig.theme.colors.neutrals[900],
									mainColorHighlight: appConfig.theme.colors.primary[500],
									backgroundColor: appConfig.theme.colors.neutrals[800],
								},
							}}
						/>
						<Button
							type='submit'
							label='Entrar'
							disabled={isDisabled}
							fullWidth
							buttonColors={{
								contrastColor: appConfig.theme.colors.neutrals['000'],
								mainColor: appConfig.theme.colors.primary[500],
								mainColorLight: appConfig.theme.colors.primary[400],
								mainColorStrong: appConfig.theme.colors.primary[600],
							}}
						/>
					</Box>
					{/* Formulário */}

					{/* Photo Area */}
					<Box
						styleSheet={{
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
							maxWidth: '200px',
							padding: '16px',
							backgroundColor: appConfig.theme.colors.neutrals[800],
							border: '1px solid',
							borderColor: appConfig.theme.colors.neutrals[999],
							borderRadius: '10px',
							flex: 1,
							minHeight: '240px',
						}}
					>
						<Image
							styleSheet={{
								borderRadius: '50%',
								marginBottom: '16px',
							}}
							src={`https://github.com/${username}.png`}
						/>
						<Text
							variant='body4'
							styleSheet={{
								color: appConfig.theme.colors.neutrals[200],
								backgroundColor: appConfig.theme.colors.neutrals[900],
								padding: '3px 10px',
								borderRadius: '1000px',
							}}
						>
							{username}
						</Text>
					</Box>
					{/* Photo Area */}
				</Box>
			</Box>
		</>
	);
}
