import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Tailwind,
  Text,
} from '@react-email/components';

interface AccountDeletedEmailProps {
  email: string;
}

export default function AccountDeletedEmail({
  email,
}: AccountDeletedEmailProps) {
  return (
    <Html>
      <Head />
      <Tailwind>
        <Preview>Ваш аккаунт удалён — FullToDo</Preview>
        <Body className='bg-[#f6f9fc] font-sans'>
          <Container className='bg-white mx-auto my-10 p-10 rounded-lg max-w-140'>
            <Heading className='text-2xl font-bold text-[#1a1a1a] mb-6'>
              FullToDo
            </Heading>

            <Section>
              <Text className='text-base text-[#444444] leading-6 mb-4'>
                Аккаунт <span className='font-semibold'>{email}</span> был
                удалён. Все ваши данные удалены с наших серверов.
              </Text>
              <Text className='text-base text-[#444444] leading-6 mb-4'>
                Если это были вы — спасибо, что пользовались FullToDo.
              </Text>
            </Section>

            <Section className='bg-red-50 border border-red-200 rounded-md p-4 my-6'>
              <Text className='text-sm text-red-800 m-0'>
                Если вы не удаляли аккаунт — немедленно обратитесь в поддержку.
              </Text>
            </Section>

            <Section className='border-t border-[#eeeeee] mt-8 pt-4'>
              <Text className='text-xs text-[#aaaaaa]'>
                Это автоматическое уведомление от FullToDo.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
