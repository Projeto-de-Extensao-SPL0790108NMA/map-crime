from django.test import TestCase

class BasicTest(TestCase):
    def test_basic_functionality(self):
        self.assertEqual(1 + 1, 2)  # Teste simples de adição
        self.assertTrue(True)  # Teste de condição verdadeira
        self.assertFalse(False)  # Teste de condição falsa