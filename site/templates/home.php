<?php snippet('header') ?>

  <main class="main main_home">
    
    <?php foreach ( $page -> videos() as $video ) : ?>
    
      <section class="grid">
        
        <div class="grid__item grid__item_1 grid__item_video">
          
          <video
            src="<?= $video -> url() ?>"
            type="<?= $video -> mime() ?>"
            poster="<?= $page -> images() -> find('poster.jpg') -> url() ?>"
            controls
          ></video>
          
        </div>
        
      </section>
    
    <?php endforeach; ?>
    
    <section class="grid">
      
      <div class="grid__item grid__item_1 grid__item_text text-2">
      
        <div>
      
          <?= $page -> introduction() -> kirbytext() ?>
        
        </div>
      
      </div>
      
    </section>
    
    <section class="grid">
      
      <?php foreach ( $site -> index() -> filterBy( 'template', 'artist' ) as $artist ) : ?>
      
      <?php $id = $artist -> shape_id(); ?>
            
        <div
          class="artist grid__item grid__item_3"
          data-params="<?php snippet('params', ['id' => $id] ) ?>"
        >
          
          <div class="artist__thumbnail" style="background-image: url(https://collectingeurope.net/request.php?q=/img_hi/<?= $id ?>)"></div>
          
          <div class="artist__label text-3"><?= $artist -> title() ?></div>
          
          <a class="artist__link" href="<?= $artist -> url() ?>"></a>
          
        </div>
      
      <?php endforeach ?>
      
    </section>

  </main>

<?php snippet('footer') ?>