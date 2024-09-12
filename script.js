const wheel = document.getElementById('wheel');
const spinBtn = document.getElementById('spin-btn');
const finalValue = document.getElementById('final-value');

const prizeModal = document.getElementById('prizeModal');
const prizeName = document.getElementById('prizeName');
const prizeImage = document.getElementById('prizeImage');
const closeModal = document.getElementsByClassName('close')[0];

//Objeto que armazena os valores de ângulo mínimo e máximo para um valor
const rotationValues = [
  { minDegree: 0, maxDegree: 36, value: 2 },
  { minDegree: 37, maxDegree: 108, value: 1 },
  { minDegree: 109, maxDegree: 180, value: 5 },
  { minDegree: 181, maxDegree: 252, value: 4 },
  { minDegree: 253, maxDegree: 324, value: 3 },
  { minDegree: 325, maxDegree: 360, value: 2 },
];

const resultValueMap = {
  1: { name: 'Carregador Portátil', image: 'fone.webp' },
  2: { name: 'Fone de Ouvido', image: 'fone.webp' },
  3: { name: 'Smartwatch', image: 'fone.webp' },
  4: { name: 'Tentativa Extra', image: 'fone.webp' },
  5: { name: 'Desconto de 50%', image: 'fone.webp' },
};

//Tamanho de cada pedaço
const data = [20, 20, 20, 20, 20];

//Cor de fundo para cada pedaço
var pieColors = ['#3f297e', '#1d61ac', '#169ed8', '#209b6c', '#60b236'];

// Fechar o modal quando o usuário clicar no botão de fechar
closeModal.onclick = function () {
  prizeModal.style.display = 'none';
};

// Fechar o modal quando o usuário clicar fora do modal
window.onclick = function (event) {
  if (event.target == prizeModal) {
    prizeModal.style.display = 'none';
  }
};

//Criar gráfico
let myChart = new Chart(wheel, {
  //Plugin para exibir texto no gráfico de pizza
  plugins: [ChartDataLabels],
  //Tipo de gráfico: Pizza
  type: 'pie',
  data: {
    //Rótulos (valores que serão exibidos no gráfico)
    labels: ['Carregador', 'Fone', 'Smartwatch', 'Extra', 'Desconto'],
    //Configurações para o conjunto de dados/gráfico de pizza
    datasets: [
      {
        backgroundColor: pieColors,
        data: data,
      },
    ],
  },
  options: {
    //Gráfico responsivo
    responsive: true,
    animation: { duration: 0 },
    plugins: {
      //Esconder tooltip e legenda
      tooltip: false,
      legend: {
        display: false,
      },
      //Exibir rótulos dentro do gráfico de pizza
      datalabels: {
        color: '#ffffff',
        formatter: (_, context) => context.chart.data.labels[context.dataIndex],
        font: { size: 24 },
      },
    },
  },
});

//Exibir valor baseado no ângulo aleatório
const valueGenerator = (angleValue) => {
  for (let i of rotationValues) {
    //Se o valor do ângulo estiver entre o mínimo e o máximo, exibe-o
    if (angleValue >= i.minDegree && angleValue <= i.maxDegree) {
      console.log('Min:', i.minDegree, 'Max:', i.maxDegree, 'Value:', i.value);
      const prize = resultValueMap[i.value];
      finalValue.innerHTML = `<p>Resultado: ${prize.name}</p>`;

      prizeName.innerHTML = prize.name;
      prizeImage.src = prize.image;
      prizeModal.style.display = 'block';
      spinBtn.disabled = false;

      submitForm(prize);
      break;
    }
  }
};

//Contador de giros
let count = 0;
//100 rotações para a animação e a última rotação para o resultado
let resultValue = 101;

//Iniciar rotação
spinBtn.addEventListener('click', () => {
  spinBtn.disabled = true;
  //Limpar valor final
  finalValue.innerHTML = `<p>Boa Sorte!</p>`;
  //Gerar graus aleatórios para parar
  let randomDegree = Math.floor(Math.random() * (355 - 0 + 1) + 0);
  //Intervalo para a animação de rotação
  let rotationInterval = window.setInterval(() => {
    //Definir rotação para o gráfico de pizza
    /*
    Inicialmente, para fazer o gráfico de pizza girar mais rápido, definimos resultValue para 101, então ele gira 101 graus por vez e isso diminui em 1 a cada contagem. Eventualmente, na última rotação, giramos 1 grau por vez.
    */
    myChart.options.rotation = myChart.options.rotation + resultValue;
    //Atualizar gráfico com o novo valor
    myChart.update();
    //Se a rotação for >360, redefine para 0
    if (myChart.options.rotation >= 360) {
      count += 1;
      resultValue -= 5;
      myChart.options.rotation = 0;
    } else if (count > 15 && myChart.options.rotation == randomDegree) {
      valueGenerator(randomDegree);
      clearInterval(rotationInterval);
      count = 0;
      resultValue = 101;
    }
  }, 11);
});

const submitForm = (prize) => {
  const formData = {
    name: document.getElementById('name').value,
    school: document.getElementById('school').value,
    dob: document.getElementById('dob').value,
    phone: document.getElementById('phone').value,
    prize: prize,
  };

  console.log(formData);

  fetch('https://sua-api.com/endpoint', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
    })
    .catch((error) => {
      console.error('Error:', error);
    });
};

document
  .getElementById('userForm')
  .addEventListener('submit', function (event) {
    event.preventDefault();
    document.querySelector('.wrapper-prize').style.display = 'block';
    document.querySelector('#userForm').style.display = 'none';
  });
