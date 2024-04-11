# NOM: Nibiru Options Marketplace

NOM (Nibiru Options Marketplace) is a full-stack web3 application that serves as a simple options marketplace for the Nibiru chain on the Cosmic ecosystem. It allows users to trade options contracts on the Nibiru chain efficiently.

## Installation

To run NOM locally, you need to set up the frontend, backend, and contracts components. Follow the instructions below:

### Frontend

The frontend is built using Next.js. To install and run the frontend:

```bash
cd frontend
npm install
npm run dev
```

Access the frontend at `http://localhost:3000`.

### Contracts

The contracts are written in Rust using the ink! framework. To compile the contracts:

```bash
cd contracts
cargo build
```

### Backend

The backend is built using Flask and "will utilizes Docker for containerization". To run the backend:

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app:app --reload
# docker build -t nom-backend .
# docker run -p 5000:5000 nom-backend
```

Access the backend WebSocket server at `http://localhost:5000`.

## Usage

Once all components are running, you can interact with the NOM application through the frontend interface. Users can create accounts, trade options, view market data, and more.

## Contributing

Contributions to NOM are welcome! If you'd like to contribute, please follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/new-feature`).
3. Make your changes.
4. Commit your changes (`git commit -am 'Add new feature'`).
5. Push to the branch (`git push origin feature/new-feature`).
6. Create a new Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgements

- This project utilizes Next.js, Flask, Rust (with ink!), and Docker.
- Special thanks to the Cosmic ecosystem and the Nibiru chain for providing the infrastructure for NOM.
