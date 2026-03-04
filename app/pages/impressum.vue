<script setup lang="ts">
useHead({ title: 'Impressum - HAJO4Kids' })
</script>

<template>
  <div class="max-w-3xl mx-auto">
    <h1 class="text-3xl font-bold mb-8">Impressum</h1>

    <Card class="mb-6">
      <CardHeader>
        <CardTitle>Angaben gemäß § 5 TMG</CardTitle>
      </CardHeader>
      <CardContent class="space-y-2">
        <p><strong>HAJO4Kids</strong></p>
        <p>Ein Projekt zur Förderung von Familienausflügen</p>
      </CardContent>
    </Card>

    <Card class="mb-6">
      <CardHeader>
        <CardTitle>Vertreten durch</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Kelvin (Administrator)</p>
      </CardContent>
    </Card>

    <Card class="mb-6">
      <CardHeader>
        <CardTitle>Kontakt</CardTitle>
      </CardHeader>
      <CardContent class="space-y-2">
        <p><strong>E-Mail:</strong> info@hajo4kids.de</p>
        <p><strong>Website:</strong> www.hajo4kids.de</p>
      </CardContent>
    </Card>

    <Card class="mb-6">
      <CardHeader>
        <CardTitle>Haftung für Inhalte</CardTitle>
      </CardHeader>
      <CardContent>
        <p class="text-muted-foreground text-sm">
          Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.
        </p>
        <p class="text-muted-foreground text-sm mt-4">
          Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den allgemeinen Gesetzen bleiben hiervon unberührt. Eine diesbezügliche Haftung ist jedoch erst ab dem Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung möglich. Bei Bekanntwerden von entsprechenden Rechtsverletzungen werden wir diese Inhalte umgehend entfernen.
        </p>
      </CardContent>
    </Card>

    <Card class="mb-6">
      <CardHeader>
        <CardTitle>Urheberrecht</CardTitle>
      </CardHeader>
      <CardContent>
        <p class="text-muted-foreground text-sm">
          Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.
        </p>
        <p class="text-muted-foreground text-sm mt-4">
          Soweit die Inhalte auf dieser Seite nicht vom Betreiber erstellt wurden, werden die Urheberrechte Dritter beachtet. Insbesondere werden Inhalte Dritter als solche gekennzeichnet. Sollten Sie trotzdem auf eine Urheberrechtsverletzung aufmerksam werden, bitten wir um einen entsprechenden Hinweis.
        </p>
      </CardContent>
    </Card>

    <div class="text-center mt-8">
      <NuxtLink to="/">
        <Button variant="outline">Zurück zur Startseite</Button>
      </NuxtLink>
    </div>
  </div>
</template>